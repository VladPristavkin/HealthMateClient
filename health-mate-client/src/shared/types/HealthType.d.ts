import { NoteData } from "./NoteType";

export type HealthType = {
    id: string;
    userId: string;
    systolicBloodPressure: number;
    diastolicBloodPressure: number;
    heartRate: number;
    bloodSugar: number;
    cholesterol: number;
    date: string;
    notes: NoteData[];
}
