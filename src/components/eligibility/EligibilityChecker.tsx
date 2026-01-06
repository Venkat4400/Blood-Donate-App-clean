import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Heart,
  Scale,
  Calendar,
  Cigarette,
  Wine,
  Syringe,
  Pill,
  Activity
} from "lucide-react";

interface EligibilityCriteria {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  required: boolean;
  weight: number;
  category: "basic" | "health" | "lifestyle";
}

const eligibilityCriteria: EligibilityCriteria[] = [
  {
    id: "age",
    label: "Age between 18-65 years",
    description: "You must be within the safe donation age range",
    icon: Calendar,
    required: true,
    weight: 20,
    category: "basic",
  },
  {
    id: "weight",
    label: "Weight at least 50 kg (110 lbs)",
    description: "Minimum weight ensures safe blood volume extraction",
    icon: Scale,
    required: true,
    weight: 20,
    category: "basic",
  },
  {
    id: "lastDonation",
    label: "No donation in last 90 days",
    description: "Your body needs time to replenish blood cells",
    icon: Calendar,
    required: true,
    weight: 15,
    category: "basic",
  },
  {
    id: "healthyToday",
    label: "Feeling healthy and well today",
    description: "No fever, cold, or feeling unwell",
    icon: Heart,
    required: true,
    weight: 15,
    category: "health",
  },
  {
    id: "noTattoo",
    label: "No tattoos or piercings in last 6 months",
    description: "Recent body modifications may carry infection risks",
    icon: Syringe,
    required: false,
    weight: 5,
    category: "health",
  },
  {
    id: "noSurgery",
    label: "No major surgery in last 6 months",
    description: "Your body needs time to fully recover",
    icon: Activity,
    required: false,
    weight: 5,
    category: "health",
  },
  {
    id: "noSmoking",
    label: "No smoking in last 24 hours",
    description: "Smoking affects blood oxygen levels",
    icon: Cigarette,
    required: false,
    weight: 5,
    category: "lifestyle",
  },
  {
    id: "noAlcohol",
    label: "No alcohol in last 48 hours",
    description: "Alcohol affects blood quality",
    icon: Wine,
    required: false,
    weight: 5,
    category: "lifestyle",
  },
  {
    id: "noMedication",
    label: "No blood-affecting medications",
    description: "Antibiotics, aspirin, etc. in last 7 days",
    icon: Pill,
    required: false,
    weight: 5,
    category: "health",
  },
  {
    id: "noInfection",
    label: "No infectious diseases",
    description: "HIV, Hepatitis, Malaria, etc.",
    icon: XCircle,
    required: true,
    weight: 5,
    category: "health",
  },
];

interface EligibilityCheckerProps {
  onEligibilityChange?: (isEligible: boolean, score: number, checkedItems: Record<string, boolean>) => void;
}

export function EligibilityChecker({ onEligibilityChange }: EligibilityCheckerProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const { isEligible, score, categoryScores } = useMemo(() => {
    const requiredCriteria = eligibilityCriteria.filter((c) => c.required);
    const allRequiredMet = requiredCriteria.every((c) => checkedItems[c.id]);

    let totalScore = 0;
    const categories = { basic: 0, health: 0, lifestyle: 0 };
    const categoryMax = { basic: 0, health: 0, lifestyle: 0 };

    eligibilityCriteria.forEach((criteria) => {
      categoryMax[criteria.category] += criteria.weight;
      if (checkedItems[criteria.id]) {
        totalScore += criteria.weight;
        categories[criteria.category] += criteria.weight;
      }
    });

    const normalizedCategories = {
      basic: categoryMax.basic > 0 ? (categories.basic / categoryMax.basic) * 100 : 0,
      health: categoryMax.health > 0 ? (categories.health / categoryMax.health) * 100 : 0,
      lifestyle: categoryMax.lifestyle > 0 ? (categories.lifestyle / categoryMax.lifestyle) * 100 : 0,
    };

    return {
      isEligible: allRequiredMet,
      score: totalScore,
      categoryScores: normalizedCategories,
    };
  }, [checkedItems]);

  const handleCheck = (id: string, checked: boolean) => {
    const newChecked = { ...checkedItems, [id]: checked };
    setCheckedItems(newChecked);
    
    const requiredCriteria = eligibilityCriteria.filter((c) => c.required);
    const allRequiredMet = requiredCriteria.every((c) => newChecked[c.id]);
    let totalScore = 0;
    eligibilityCriteria.forEach((criteria) => {
      if (newChecked[criteria.id]) totalScore += criteria.weight;
    });
    
    onEligibilityChange?.(allRequiredMet, totalScore, newChecked);
  };

  const groupedCriteria = {
    basic: eligibilityCriteria.filter((c) => c.category === "basic"),
    health: eligibilityCriteria.filter((c) => c.category === "health"),
    lifestyle: eligibilityCriteria.filter((c) => c.category === "lifestyle"),
  };

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <Card variant="elevated">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">
                Eligibility Score
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEligible ? "You're eligible to donate!" : "Complete required criteria to donate"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  isEligible ? "bg-success/10" : "bg-warning/10"
                }`}
              >
                {isEligible ? (
                  <CheckCircle2 className="h-6 w-6 text-success" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-warning" />
                )}
              </motion.div>
              <div className="text-right">
                <p className="font-display text-3xl font-bold text-foreground">{score}</p>
                <p className="text-xs text-muted-foreground">/ 100</p>
              </div>
            </div>
          </div>

          {/* Category Progress */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: "basic", label: "Basic", color: "bg-primary" },
              { key: "health", label: "Health", color: "bg-success" },
              { key: "lifestyle", label: "Lifestyle", color: "bg-info" },
            ].map(({ key, label, color }) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{Math.round(categoryScores[key as keyof typeof categoryScores])}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${categoryScores[key as keyof typeof categoryScores]}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Criteria Cards */}
      {Object.entries(groupedCriteria).map(([category, criteria]) => (
        <Card key={category} variant="feature">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg capitalize flex items-center gap-2">
              {category === "basic" && <Scale className="h-5 w-5 text-primary" />}
              {category === "health" && <Heart className="h-5 w-5 text-success" />}
              {category === "lifestyle" && <Activity className="h-5 w-5 text-info" />}
              {category} Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence>
              {criteria.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    checkedItems[item.id]
                      ? "bg-success/5 border-success/30"
                      : "bg-card border-border hover:border-primary/30"
                  }`}
                >
                  <Checkbox
                    id={item.id}
                    checked={checkedItems[item.id] || false}
                    onCheckedChange={(checked) => handleCheck(item.id, checked as boolean)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <item.icon className={`h-4 w-4 shrink-0 ${
                        checkedItems[item.id] ? "text-success" : "text-muted-foreground"
                      }`} />
                      <Label
                        htmlFor={item.id}
                        className="font-medium cursor-pointer text-foreground"
                      >
                        {item.label}
                      </Label>
                      {item.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    +{item.weight}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
