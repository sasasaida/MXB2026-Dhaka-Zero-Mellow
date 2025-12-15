// src/hooks/useRiskAssessment.ts
import { useState, useCallback } from 'react';
import { assessPregnancyRisk, getAllRiskLevels } from '../utils/riskAssessment';
import { logRiskAssessment } from '../utils/riskLogger';

export function useRiskAssessment() {
    const [riskResult, setRiskResult] = useState<{
        level: string;
        explanation: string;
        recommendedActions: string[];
    } | null>(null);

    const assessRisk = useCallback((selectedSymptomIds: string[]) => {
        const result = assessPregnancyRisk(selectedSymptomIds);
        const logEntry = logRiskAssessment(selectedSymptomIds, result);
        console.log('Logged risk assessment:', logEntry);
        setRiskResult(result);
        return result;
    }, []);

    const clearAssessment = useCallback(() => {
        setRiskResult(null);
    }, []);

    return {
        assessRisk,
        clearAssessment,
        riskResult,
        riskLevels: getAllRiskLevels()
    };
}