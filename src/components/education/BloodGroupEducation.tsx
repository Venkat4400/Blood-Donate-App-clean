import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Droplets, 
  Heart, 
  Users, 
  Award, 
  ArrowRight, 
  Check, 
  X,
  Info,
  Sparkles
} from "lucide-react";

const bloodGroups = [
  { type: "A+", population: "35.7%", canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
  { type: "A-", population: "6.3%", canDonateTo: ["A+", "A-", "AB+", "AB-"], canReceiveFrom: ["A-", "O-"], rare: true },
  { type: "B+", population: "8.5%", canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
  { type: "B-", population: "1.5%", canDonateTo: ["B+", "B-", "AB+", "AB-"], canReceiveFrom: ["B-", "O-"], rare: true },
  { type: "AB+", population: "3.4%", canDonateTo: ["AB+"], canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], universal: "receiver" },
  { type: "AB-", population: "0.6%", canDonateTo: ["AB+", "AB-"], canReceiveFrom: ["A-", "B-", "AB-", "O-"], rare: true },
  { type: "O+", population: "37.4%", canDonateTo: ["A+", "B+", "AB+", "O+"], canReceiveFrom: ["O+", "O-"] },
  { type: "O-", population: "6.6%", canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], canReceiveFrom: ["O-"], universal: "donor", rare: true },
];

const benefits = [
  {
    icon: Heart,
    title: "Save Up to 3 Lives",
    description: "A single blood donation can save up to three lives through component separation.",
  },
  {
    icon: Sparkles,
    title: "Health Checkup",
    description: "Free mini health checkup including blood pressure, hemoglobin, and iron levels.",
  },
  {
    icon: Users,
    title: "Reduce Heart Disease Risk",
    description: "Regular blood donation can reduce the risk of heart disease by lowering iron stores.",
  },
  {
    icon: Award,
    title: "Burn Calories",
    description: "Donating blood burns approximately 650 calories per donation.",
  },
];

const compatibilityMatrix = [
  ["A+", true, false, false, false, true, false, false, false],
  ["A-", true, true, false, false, true, true, false, false],
  ["B+", false, false, true, false, true, false, false, false],
  ["B-", false, false, true, true, true, true, false, false],
  ["AB+", true, true, true, true, true, true, true, true],
  ["AB-", false, true, false, true, false, true, false, true],
  ["O+", false, false, false, false, false, false, true, false],
  ["O-", false, false, false, false, false, false, true, true],
];

export function BloodGroupEducation() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const selectedGroupData = bloodGroups.find((g) => g.type === selectedGroup);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Droplets className="h-4 w-4" />
          Blood Group Knowledge
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          Understanding Blood Types
        </h2>
        <p className="text-muted-foreground text-lg">
          Learn about blood group compatibility, rare blood types, and the importance of blood donation.
        </p>
      </div>

      <Tabs defaultValue="compatibility" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="facts">Quick Facts</TabsTrigger>
        </TabsList>

        <TabsContent value="compatibility" className="space-y-6">
          {/* Blood Group Selector */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {bloodGroups.map((group) => (
              <motion.button
                key={group.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGroup(group.type === selectedGroup ? null : group.type)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedGroup === group.type
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <span className="font-display text-2xl font-bold text-foreground">{group.type}</span>
                {group.rare && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 text-[10px]">
                    Rare
                  </Badge>
                )}
                {group.universal && (
                  <Badge 
                    variant={group.universal === "donor" ? "success" : "info"} 
                    className="absolute -top-2 -right-2 text-[10px]"
                  >
                    Universal
                  </Badge>
                )}
              </motion.button>
            ))}
          </div>

          {/* Selected Group Details */}
          <AnimatePresence mode="wait">
            {selectedGroupData && (
              <motion.div
                key={selectedGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="h-24 w-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <span className="font-display text-4xl font-bold text-primary">
                            {selectedGroupData.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ~{selectedGroupData.population} of population
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-success" />
                          Can Donate To
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedGroupData.canDonateTo.map((type) => (
                            <Badge key={type} variant="success" className="text-sm">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-info rotate-180" />
                          Can Receive From
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedGroupData.canReceiveFrom.map((type) => (
                            <Badge key={type} variant="info" className="text-sm">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compatibility Matrix */}
          <Card variant="feature">
            <CardHeader>
              <CardTitle>Compatibility Matrix</CardTitle>
              <CardDescription>Who can receive from whom</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2 font-medium text-muted-foreground">Recipient ↓ / Donor →</th>
                      {bloodGroups.map((g) => (
                        <th key={g.type} className="p-2 font-medium text-center">{g.type}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compatibilityMatrix.map((row, i) => (
                      <tr key={row[0] as string} className="border-t border-border">
                        <td className="p-2 font-medium">{row[0]}</td>
                        {row.slice(1).map((compatible, j) => (
                          <td key={j} className="p-2 text-center">
                            {compatible ? (
                              <Check className="h-4 w-4 text-success mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-destructive/40 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="feature" className="h-full">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="facts">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { stat: "4.5M", label: "Units needed annually in India" },
              { stat: "1 in 3", label: "People will need blood in their lifetime" },
              { stat: "42 days", label: "Shelf life of donated blood" },
              { stat: "8-10 min", label: "Time to donate blood" },
              { stat: "1 pint", label: "Amount donated per session" },
              { stat: "56 days", label: "Minimum gap between donations" },
            ].map((fact, index) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="stat">
                  <CardContent className="p-6 text-center">
                    <p className="font-display text-3xl font-bold text-primary mb-1">
                      {fact.stat}
                    </p>
                    <p className="text-sm text-muted-foreground">{fact.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
