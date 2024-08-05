import { NoteType } from "./Note";

export type Health = {
    id: string;
    systolicBloodPressure: number;
    diastolicBloodPressure: number;
    heartRate: number;
    bloodSugar: number;
    cholesterol: number;
    date: string;
    notes: NoteType[];
}

export type ShortHealth = {
    userId: string;
    systolicBloodPressure: number;
    diastolicBloodPressure: number;
    heartRate: number;
    bloodSugar: number;
    cholesterol: number;
    date: string;
    notes: NoteType[];
}
