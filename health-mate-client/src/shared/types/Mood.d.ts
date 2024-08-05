import { MoodStatus } from "./MoodStatus";
import { Note } from "./Note";

export type Mood = {
    id: string;
    moodStatus: MoodStatus;
    stressLevel: number;
    date: string;
    notes: Note[];
}

export type ShortMood = {
    userId: string;
    moodStatus: MoodStatus;
    stressLevel: number;
    date: string;
    notes: Note[];
}
