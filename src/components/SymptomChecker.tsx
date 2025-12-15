// src/components/SymptomChecker.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { PREGNANCY_SYMPTOMS } from '@/data/pregnancySymptoms';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { useRiskAssessment } from '../hooks/useRiskAssessment';
import { RiskResult } from './RiskResult';


type SymptomId = typeof PREGNANCY_SYMPTOMS[number]['id'];

const CATEGORY_ICONS: Record<string, string> = {
    digestive: '🍽️',
    general: '🌡️',
    breast: '👙',
    urinary: '🚽',
    emotional: '😊',
    respiratory: '🌬️',
    neurological: '🧠',
    musculoskeletal: '💪',
    circulatory: '❤️',
    uterine: '🤰',
    pelvic: '🦴',
    sleep: '😴'
};


export function SymptomChecker() {
    const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomId[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const { assessRisk, clearAssessment, riskResult, riskLevels } = useRiskAssessment();

    const handleCheckRisk = () => {
        assessRisk(selectedSymptoms);
    };


    // Load saved symptoms from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('selected_symptoms');
        if (saved) {
            setSelectedSymptoms(JSON.parse(saved));
        }
    }, []);

    // Save symptoms to localStorage when they change
    useEffect(() => {
        if (selectedSymptoms.length > 0) {
            localStorage.setItem('selected_symptoms', JSON.stringify(selectedSymptoms));
        } else {
            localStorage.removeItem('selected_symptoms');
        }
    }, [selectedSymptoms]);

    const toggleSymptom = (symptomId: SymptomId) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptomId)
                ? prev.filter(id => id !== symptomId)
                : [...prev, symptomId]
        );
    };

    const clearAll = () => {
        setSelectedSymptoms([]);
        localStorage.removeItem('selected_symptoms');
    };

    // Get unique categories
    const categories = Array.from(new Set(PREGNANCY_SYMPTOMS.map(s => s.category)));
    const filteredSymptoms = activeCategory
        ? PREGNANCY_SYMPTOMS.filter(s => s.category === activeCategory)
        : PREGNANCY_SYMPTOMS;

    return (
        <Card className="border-border">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <span>🤰</span>
                        Symptom Tracker
                    </CardTitle>
                    {selectedSymptoms.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${!activeCategory
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted hover:bg-muted/80'
                                }`}
                        >
                            <Filter className="h-3.5 w-3.5" />
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${activeCategory === category
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-muted hover:bg-muted/80'
                                    }`}
                            >
                                {CATEGORY_ICONS[category] || '•'} {category}
                            </button>
                        ))}
                    </div>

                    {/* Symptoms List */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {filteredSymptoms.map((symptom) => (
                            <div
                                key={symptom.id}
                                className="flex items-center space-x-3 rounded-lg p-3 hover:bg-muted/50"
                            >
                                <Checkbox
                                    id={symptom.id}
                                    checked={selectedSymptoms.includes(symptom.id)}
                                    onCheckedChange={() => toggleSymptom(symptom.id)}
                                    className="h-5 w-5 rounded"
                                />
                                <Label
                                    htmlFor={symptom.id}
                                    className="flex-1 text-sm font-medium leading-none cursor-pointer"
                                >
                                    {symptom.label}
                                </Label>
                                <Badge variant="outline" className="text-xs">
                                    {symptom.category}
                                </Badge>
                            </div>
                        ))}
                    </div>

                    {/* Selected Symptoms */}
                    {selectedSymptoms.length > 0 && (
                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium">Selected Symptoms</p>
                                <span className="text-xs text-muted-foreground">
                                    {selectedSymptoms.length} selected
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedSymptoms.map(id => {
                                    const symptom = PREGNANCY_SYMPTOMS.find(s => s.id === id);
                                    return symptom ? (
                                        <Badge
                                            key={id}
                                            variant="secondary"
                                            className="flex items-center gap-1.5"
                                        >
                                            {symptom.label}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSymptom(id);
                                                }}
                                                className="rounded-full hover:bg-muted-foreground/10 p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
                </div>
                {!riskResult ? (
                    <Button
                        onClick={handleCheckRisk}
                        disabled={selectedSymptoms.length === 0}
                        className="w-full mt-4"
                    >
                        Check Risk Level
                    </Button>
                ) : (
                    <div className="mt-4 space-y-4">
                        <Alert className={riskResult.level === 'HIGH' ? 'bg-red-50 border-red-200' :
                            riskResult.level === 'MEDIUM' ? 'bg-amber-50 border-amber-200' :
                                'bg-green-50 border-green-200'}>
                            <AlertCircle className={`h-5 w-5 ${riskResult.level === 'HIGH' ? 'text-red-600' :
                                riskResult.level === 'MEDIUM' ? 'text-amber-600' :
                                    'text-green-600'
                                }`} />
                            <AlertTitle className="capitalize">
                                {riskResult.level} Risk
                            </AlertTitle>
                            <AlertDescription className="space-y-2">
                                <p>{riskResult.explanation}</p>
                                <div className="mt-2">
                                    <p className="font-medium">Recommended Actions:</p>
                                    <ul className="list-disc pl-5 space-y-1 mt-1">
                                        {riskResult.recommendedActions.map((action, i) => (
                                            <li key={i}>{action}</li>
                                        ))}
                                    </ul>
                                </div>
                            </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                onClick={clearAssessment}
                                className="w-full"
                            >
                                Check Different Symptoms
                            </Button>
                        </div>
                    </div>
                )}


                <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Understanding Risk Levels
                    </h4>
                    <div className="space-y-2">
                        {riskLevels.map(({ level, description }) => (
                            <div key={level} className="flex items-start gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${level === 'HIGH' ? 'bg-red-100 text-red-800' :
                                    level === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                    {level}
                                </span>
                                <span className="text-sm text-muted-foreground">{description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}