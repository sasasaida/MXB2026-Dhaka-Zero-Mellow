// src/types/emergency.ts
export interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    isPrimary: boolean;
    relationship: string;
}