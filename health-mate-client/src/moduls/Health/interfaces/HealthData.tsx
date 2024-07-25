import { NoteData } from "./NoteData";

export interface HealthData {
    id: string;
    systolicBloodPressure: number;
    diastolicBloodPressure: number;
    heartRate: number;
    bloodSugar: number;
    cholesterol: number;
    date: string;
    notes: NoteData[];
}