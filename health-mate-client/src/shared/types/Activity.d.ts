import { ActivityType } from "./ActivityType";
import { Note } from "./Note";

export type Activity = {
    id: string;
    activityType: ActivityType;
    duration: string;
    caloriesBurned: number;
    date: string;
    notes: Note[];
}

export type ShortActivity = {
    userId: string;
    activityTypeId: string;
    duration: string;
    caloriesBurned: number;
    date: string;
    notes: Note[];
}
