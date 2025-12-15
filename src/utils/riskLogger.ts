// src/utils/riskLogger.ts
interface RiskLogEntry {
    id: string;
    date: string;
    symptoms: string[];
    riskLevel: string;
    explanation: string;
}

const RISK_LOG_KEY = 'risk_assessment_logs';

export function logRiskAssessment(symptoms: string[], result: { level: string; explanation: string }) {
    const logs = getRiskLogs();
    const newLog: RiskLogEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        symptoms,
        riskLevel: result.level,
        explanation: result.explanation
    };

    logs.unshift(newLog); // Add new log to beginning of array
    localStorage.setItem(RISK_LOG_KEY, JSON.stringify(logs));
    return newLog;
}

export function getRiskLogs(): RiskLogEntry[] {
    const logs = localStorage.getItem(RISK_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
}

export function clearRiskLogs() {
    localStorage.removeItem(RISK_LOG_KEY);
}

// src/utils/riskLogger.ts
// ... (previous code)

export function getFormattedLogs() {
    const logs = getRiskLogs();
    return logs.map(log => ({
        ...log,
        formattedDate: new Date(log.date).toLocaleString(),
        symptomCount: log.symptoms.length
    }));
}