// src/utils/nutritionData.ts
import nutritionData from '@/data/nutritionData.json';

type WeekRange = keyof typeof nutritionData;

export interface NutritionItem {
    nutrient: string;
    food: string;
    icon: string;
    importance: string;
}

export const getNutritionForWeek = (week: number): NutritionItem[] => {
    let range: WeekRange;

    if (week <= 4) range = '1-4';
    else if (week <= 8) range = '5-8';
    else if (week <= 12) range = '9-12';
    else if (week <= 16) range = '13-16';
    else if (week <= 20) range = '17-20';
    else if (week <= 24) range = '21-24';
    else if (week <= 28) range = '25-28';
    else if (week <= 32) range = '29-32';
    else if (week <= 36) range = '33-36';
    else range = '37-40';

    return nutritionData[range] as NutritionItem[];
};