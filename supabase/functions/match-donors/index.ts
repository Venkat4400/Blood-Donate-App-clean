import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Blood compatibility matrix - who can donate to whom
const BLOOD_COMPATIBILITY: Record<string, string[]> = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], // Universal donor
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"], // Universal recipient
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Calculate match score based on multiple factors
function calculateMatchScore(
  donor: any,
  requestBloodType: string,
  requestLat: number | null,
  requestLon: number | null,
  urgency: string
): { score: number; factors: Record<string, number>; distance: number | null } {
  let score = 0;
  const factors: Record<string, number> = {};
  let distance: number | null = null;

  // Blood compatibility score (40% weight)
  const compatibleTypes = Object.entries(BLOOD_COMPATIBILITY)
    .filter(([, recipients]) => recipients.includes(requestBloodType))
    .map(([donor]) => donor);
  
  if (compatibleTypes.includes(donor.blood_type)) {
    // Exact match gets higher score
    if (donor.blood_type === requestBloodType) {
      factors.bloodCompatibility = 40;
    } else {
      factors.bloodCompatibility = 30;
    }
    score += factors.bloodCompatibility;
  } else {
    return { score: 0, factors: {}, distance: null }; // Not compatible
  }

  // Distance score (30% weight) - only if coordinates available
  if (requestLat && requestLon && donor.latitude && donor.longitude) {
    distance = calculateDistance(requestLat, requestLon, donor.latitude, donor.longitude);
    if (distance <= 5) {
      factors.distance = 30;
    } else if (distance <= 10) {
      factors.distance = 25;
    } else if (distance <= 25) {
      factors.distance = 20;
    } else if (distance <= 50) {
      factors.distance = 15;
    } else if (distance <= 100) {
      factors.distance = 10;
    } else {
      factors.distance = 5;
    }
    score += factors.distance;
  } else {
    factors.distance = 15; // Default if no location
    score += factors.distance;
  }

  // Reliability score (20% weight)
  const reliabilityScore = donor.reliability_score || 5;
  factors.reliability = Math.round((reliabilityScore / 10) * 20);
  score += factors.reliability;

  // Availability and eligibility (10% weight)
  if (donor.is_available) {
    factors.availability = 5;
    score += factors.availability;
  }
  if (donor.eligibility_score >= 80) {
    factors.eligibility = 5;
    score += factors.eligibility;
  } else if (donor.eligibility_score >= 60) {
    factors.eligibility = 3;
    score += factors.eligibility;
  }

  // Urgency boost - for emergencies, prioritize closer donors
  if (urgency === "emergency" && distance !== null && distance <= 10) {
    factors.urgencyBoost = 10;
    score += factors.urgencyBoost;
  }

  return { score, factors, distance };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId, bloodType, latitude, longitude, urgency, maxResults = 10, useAI = false } = await req.json();
    
    console.log("Matching donors for:", { requestId, bloodType, latitude, longitude, urgency, maxResults, useAI });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find compatible blood types
    const compatibleDonorTypes = Object.entries(BLOOD_COMPATIBILITY)
      .filter(([, recipients]) => recipients.includes(bloodType))
      .map(([donorType]) => donorType);

    console.log("Compatible donor types:", compatibleDonorTypes);

    // Fetch available donors with compatible blood types
    const { data: donors, error: donorsError } = await supabase
      .from("donor_profiles")
      .select(`
        *,
        profiles:user_id (
          full_name,
          phone,
          city,
          state,
          latitude,
          longitude
        )
      `)
      .in("blood_type", compatibleDonorTypes)
      .eq("is_available", true);

    if (donorsError) {
      console.error("Error fetching donors:", donorsError);
      throw donorsError;
    }

    console.log(`Found ${donors?.length || 0} potential donors`);

    if (!donors || donors.length === 0) {
      return new Response(
        JSON.stringify({ 
          matches: [], 
          message: "No compatible donors found",
          compatibleTypes: compatibleDonorTypes 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate match scores for each donor
    const scoredDonors = donors.map((donor) => {
      const donorLat = donor.profiles?.latitude || null;
      const donorLon = donor.profiles?.longitude || null;
      const { score, factors, distance } = calculateMatchScore(
        { ...donor, latitude: donorLat, longitude: donorLon },
        bloodType,
        latitude,
        longitude,
        urgency || "normal"
      );

      return {
        donor_id: donor.user_id,
        blood_type: donor.blood_type,
        match_score: score,
        score_factors: factors,
        distance_km: distance,
        reliability_score: donor.reliability_score,
        total_donations: donor.total_donations,
        last_donation_date: donor.last_donation_date,
        eligibility_score: donor.eligibility_score,
        profile: {
          full_name: donor.profiles?.full_name || "Anonymous Donor",
          phone: donor.profiles?.phone,
          city: donor.profiles?.city,
          state: donor.profiles?.state,
        },
      };
    });

    // Filter out zero scores and sort by match score
    const rankedDonors = scoredDonors
      .filter((d) => d.match_score > 0)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, maxResults);

    console.log(`Returning ${rankedDonors.length} matched donors`);

    // Use AI for enhanced matching insights if requested
    let aiInsights = null;
    if (useAI && rankedDonors.length > 0) {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (LOVABLE_API_KEY) {
        try {
          const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                {
                  role: "system",
                  content: `You are a medical matching assistant for blood donation. Analyze donor matches and provide brief, actionable insights. Be concise and professional.`
                },
                {
                  role: "user",
                  content: `Blood request: ${bloodType}, Urgency: ${urgency || "normal"}, Location: ${latitude && longitude ? "provided" : "not provided"}
                  
Top ${Math.min(3, rankedDonors.length)} matches:
${rankedDonors.slice(0, 3).map((d, i) => `${i + 1}. ${d.blood_type} donor, Score: ${d.match_score}, Distance: ${d.distance_km ? d.distance_km.toFixed(1) + "km" : "unknown"}, Reliability: ${d.reliability_score}/10`).join("\n")}

Provide a brief (2-3 sentences) insight about these matches and any recommendations.`
                }
              ],
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            aiInsights = aiData.choices?.[0]?.message?.content;
          }
        } catch (aiError) {
          console.error("AI insights error:", aiError);
        }
      }
    }

    // Store matches in database if requestId provided
    if (requestId) {
      const matchesToInsert = rankedDonors.slice(0, 5).map((match) => ({
        request_id: requestId,
        donor_id: match.donor_id,
        match_score: match.match_score,
        distance_km: match.distance_km,
        status: "pending",
      }));

      // Use upsert to avoid duplicates
      const { error: insertError } = await supabase
        .from("donor_matches")
        .upsert(matchesToInsert, { onConflict: "request_id,donor_id" });

      if (insertError) {
        console.error("Error storing matches:", insertError);
      }
    }

    return new Response(
      JSON.stringify({
        matches: rankedDonors,
        total_compatible: scoredDonors.filter((d) => d.match_score > 0).length,
        compatible_types: compatibleDonorTypes,
        ai_insights: aiInsights,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Match donors error:", error);
    
    const err = error as { status?: number; message?: string };
    
    if (err.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: err.message || "Failed to match donors" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
