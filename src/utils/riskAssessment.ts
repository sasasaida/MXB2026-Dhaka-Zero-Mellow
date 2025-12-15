// src/utils/riskAssessment.ts
import { PREGNANCY_SYMPTOMS } from '@/data/pregnancySymptoms';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface RiskRule {
    condition: (symptoms: string[]) => boolean;
    level: RiskLevel;
    explanation: string;
}

// Define risk rules in order of priority (HIGH to LOW)
const RISK_RULES: RiskRule[] = [
    // High-risk symptoms (immediate medical attention needed)
    {
        condition: (symptoms) => symptoms.includes('severe_abdominal_pain'),
        level: 'HIGH',
        explanation: 'Severe abdominal pain requires immediate medical attention'
    },
    {
        condition: (symptoms) => symptoms.includes('vaginal_bleeding'),
        level: 'HIGH',
        explanation: 'Vaginal bleeding during pregnancy requires immediate evaluation'
    },
    {
        condition: (symptoms) => symptoms.includes('severe_headache') && symptoms.includes('vision_changes'),
        level: 'HIGH',
        explanation: 'Severe headache with vision changes could indicate preeclampsia'
    },
    {
        condition: (symptoms) => symptoms.includes('decreased_fetal_movement'),
        level: 'HIGH',
        explanation: 'Decreased fetal movement needs immediate medical assessment'
    },

    // Medium-risk symptoms (contact healthcare provider soon)
    {
        condition: (symptoms) => symptoms.includes('contractions') && symptoms.filter(s => s === 'contractions').length > 4,
        level: 'MEDIUM',
        explanation: 'Frequent contractions could indicate preterm labor'
    },
    {
        condition: (symptoms) => symptoms.includes('severe_swelling') && symptoms.includes('headache'),
        level: 'MEDIUM',
        explanation: 'Severe swelling with headache could indicate blood pressure issues'
    },
    {
        condition: (symptoms) => symptoms.includes('fever') && symptoms.includes('abdominal_pain'),
        level: 'MEDIUM',
        explanation: 'Fever with abdominal pain could indicate infection'
    },
    {
        condition: (symptoms) => symptoms.includes('severe_nausea') && symptoms.includes('vomiting'),
        level: 'MEDIUM',
        explanation: 'Severe nausea and vomiting may lead to dehydration'
    },

    // Low-risk symptoms (monitor and mention at next appointment)
    {
        condition: (symptoms) => symptoms.length >= 3,
        level: 'LOW',
        explanation: 'Multiple symptoms may indicate a need for evaluation'
    },
    {
        condition: () => true, // Default case
        level: 'LOW',
        explanation: 'No high or medium risk symptoms detected'
    }
];

export function assessPregnancyRisk(selectedSymptomIds: string[]): {
    level: RiskLevel;
    explanation: string;
    recommendedActions: string[];
} {
    // Get the symptom IDs that match our risk rules
    const symptomIds = selectedSymptomIds.filter(id =>
        PREGNANCY_SYMPTOMS.some(s => s.id === id)
    );

    // Find the first matching rule
    const matchedRule = RISK_RULES.find(rule => rule.condition(symptomIds)) || RISK_RULES[RISK_RULES.length - 1];

    // Get recommended actions based on risk level
    const recommendedActions = getRecommendedActions(matchedRule.level);

    return {
        level: matchedRule.level,
        explanation: matchedRule.explanation,
        recommendedActions
    };
}

function getRecommendedActions(level: RiskLevel): string[] {
    switch (level) {
        case 'HIGH':
            return [
                'Seek immediate medical attention',
                'Call emergency services or go to the nearest hospital',
                'Contact your healthcare provider immediately'
            ];
        case 'MEDIUM':
            return [
                'Contact your healthcare provider within 24 hours',
                'Monitor symptoms closely',
                'Rest and stay hydrated'
            ];
        case 'LOW':
        default:
            return [
                'Mention these symptoms at your next appointment',
                'Monitor for any changes',
                'Practice self-care and rest'
            ];
    }
}

// Helper function to get all possible risk levels
export function getAllRiskLevels(): { level: RiskLevel; description: string }[] {
    return [
        { level: 'LOW', description: 'Continue monitoring, mention at next appointment' },
        { level: 'MEDIUM', description: 'Contact healthcare provider soon' },
        { level: 'HIGH', description: 'Seek immediate medical attention' }
    ];
}