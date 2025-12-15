// src/components/RiskResult.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface RiskResultProps {
    riskLevel: string;
    explanation: string;
    recommendedActions: string[];
    onReset: () => void;
}

export function RiskResult({ riskLevel, explanation, recommendedActions, onReset }: RiskResultProps) {
    const getRiskLevelStyles = () => {
        switch (riskLevel) {
            case 'HIGH':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-800',
                    icon: '⚠️',
                    title: 'High Risk - Seek Immediate Care'
                };
            case 'MEDIUM':
                return {
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    text: 'text-amber-800',
                    icon: 'ℹ️',
                    title: 'Medium Risk - Contact Your Healthcare Provider'
                };
            default:
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    text: 'text-green-800',
                    icon: '✅',
                    title: 'Low Risk - Continue Monitoring'
                };
        }
    };

    const styles = getRiskLevelStyles();

    return (
        <div className="space-y-4">
            <Alert className={`${styles.bg} ${styles.border} ${styles.text} border-l-4`}>
                <div className="flex items-start gap-3">
                    <span className="text-xl">{styles.icon}</span>
                    <div>
                        <AlertTitle className="font-bold text-lg">{styles.title}</AlertTitle>
                        <AlertDescription className="mt-2">
                            <p className="mb-3">{explanation}</p>

                            <div className="mt-3 space-y-2">
                                <h4 className="font-medium">Recommended Next Steps:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    {recommendedActions.map((action, index) => (
                                        <li key={index}>{action}</li>
                                    ))}
                                </ul>
                            </div>
                        </AlertDescription>
                    </div>
                </div>
            </Alert>

            {riskLevel === 'HIGH' && (
                <div className="mt-4">
                    <a href="tel:999" className="w-full">
                        <Button variant="destructive" size="lg" className="w-full">
                            <Phone className="mr-2 h-4 w-4" />
                            Call Emergency Services (999)
                        </Button>
                    </a>
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                        For immediate medical assistance
                    </p>
                </div>
            )}

            <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={onReset}>
                    Check Another Symptom
                </Button>
            </div>
        </div>
    );
}