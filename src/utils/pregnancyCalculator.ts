// src/utils/pregnancyCalculator.ts
export interface PregnancyInfo {
    lmpDate: string;
    dueDate: string;
    weeks: number;
    days: number;
    trimester: 1 | 2 | 3;
}

export const calculatePregnancyInfo = (lmpDate: string): PregnancyInfo => {
    const today = new Date();
    const lmp = new Date(lmpDate);
    const diffTime = today.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    let trimester: 1 | 2 | 3 = 1;
    if (weeks >= 13 && weeks < 27) {
        trimester = 2;
    } else if (weeks >= 27) {
        trimester = 3;
    }

    // Calculate due date (40 weeks from LMP)
    const dueDate = new Date(lmp);
    dueDate.setDate(lmp.getDate() + 280); // 40 weeks = 280 days

    return {
        lmpDate,
        dueDate: dueDate.toISOString().split('T')[0],
        weeks,
        days,
        trimester
    };
};

export const getTrimesterProgress = (trimester: number): number => {
    switch (trimester) {
        case 1: return 33;
        case 2: return 66;
        case 3: return 100;
        default: return 0;
    }
};