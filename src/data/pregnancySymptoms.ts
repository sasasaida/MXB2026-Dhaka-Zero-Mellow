// src/data/pregnancySymptoms.ts
export const PREGNANCY_SYMPTOMS = [
    { id: 'nausea', label: 'Nausea/Morning Sickness', category: 'digestive' },
    { id: 'fatigue', label: 'Fatigue', category: 'general' },
    { id: 'tender_breasts', label: 'Tender or Swollen Breasts', category: 'breast' },
    { id: 'frequent_urination', label: 'Frequent Urination', category: 'urinary' },
    { id: 'food_aversion', label: 'Food Aversions', category: 'digestive' },
    { id: 'mood_swings', label: 'Mood Swings', category: 'emotional' },
    { id: 'bloating', label: 'Bloating', category: 'digestive' },
    { id: 'constipation', label: 'Constipation', category: 'digestive' },
    { id: 'heartburn', label: 'Heartburn', category: 'digestive' },
    { id: 'nasal_congestion', label: 'Nasal Congestion', category: 'respiratory' },
    { id: 'dizziness', label: 'Dizziness', category: 'neurological' },
    { id: 'headache', label: 'Headache', category: 'neurological' },
    { id: 'backache', label: 'Backache', category: 'musculoskeletal' },
    { id: 'leg_cramps', label: 'Leg Cramps', category: 'musculoskeletal' },
    { id: 'swelling', label: 'Swelling (Edema)', category: 'circulatory' },
    { id: 'varicose_veins', label: 'Varicose Veins', category: 'circulatory' },
    { id: 'shortness_breath', label: 'Shortness of Breath', category: 'respiratory' },
    { id: 'braxton_hicks', label: 'Braxton Hicks Contractions', category: 'uterine' },
    { id: 'pelvic_pressure', label: 'Pelvic Pressure', category: 'pelvic' },
    { id: 'insomnia', label: 'Trouble Sleeping', category: 'sleep' }
] as const;