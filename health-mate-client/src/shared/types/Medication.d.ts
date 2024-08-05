import { Note } from "./Note";

export type Medication = {
    id: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    date: string;
    notes: Note[];
}

export type ShortMedication = {
    userId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    date: string;
    notes: Note[];
}
