// src/utils/prenatalAppointments.ts
import appointments from '@/data/prenatalAppointments.json';

type WeekRange = keyof typeof appointments;

export interface PrenatalAppointment {
    week: number;
    type: string;
    description: string;
    tests: string[];
    scheduledDate?: string;
    doctor?: string;
}

export const getUpcomingAppointments = (currentWeek: number): PrenatalAppointment[] => {
    let range: WeekRange;

    // Determine the current range
    if (currentWeek <= 4) range = '1-4';
    else if (currentWeek <= 8) range = '5-8';
    else if (currentWeek <= 12) range = '9-12';
    else if (currentWeek <= 16) range = '13-16';
    else if (currentWeek <= 20) range = '17-20';
    else if (currentWeek <= 24) range = '21-24';
    else if (currentWeek <= 28) range = '25-28';
    else if (currentWeek <= 32) range = '29-32';
    else range = '37-40';

    // Get appointments for current and upcoming weeks
    const upcoming = (appointments[range] as Omit<PrenatalAppointment, 'scheduledDate' | 'doctor'>[])
        .filter(apt => apt.week >= currentWeek)
        .map(apt => ({
            ...apt,
            scheduledDate: calculateAppointmentDate(apt.week, currentWeek),
            doctor: getDoctorForAppointment(apt.type)
        }));

    return upcoming.slice(0, 3); // Return next 3 appointments
};

const calculateAppointmentDate = (appointmentWeek: number, currentWeek: number): string => {
    const weeksUntilAppointment = appointmentWeek - currentWeek;
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + (weeksUntilAppointment * 7));

    return appointmentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

const getDoctorForAppointment = (type: string): string => {
    const doctors = [
        "Dr. Fatema Rahman",
        "Dr. Ayesha Khan",
        "Dr. Nusrat Jahan",
        "City Health Center"
    ];
    return type.includes('Ultrasound') || type.includes('Scan')
        ? "Radiology Department"
        : doctors[Math.floor(Math.random() * doctors.length)];
};