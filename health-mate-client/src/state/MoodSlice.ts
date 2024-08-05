import { StateCreator } from 'zustand'
import { UserSlice } from './UserSlice';
import * as api from '../api/genericApi';
import { CalendarSlice } from './CalendarSlice';
import { Mood, ShortMood } from '../shared/types/Mood';

export interface MoodSlice {
    loading: boolean;
    success: boolean;
    errorMessage: string;
    monthMoodData: Mood[];
    dayMoodData: Mood[];
    fetchMood: () => void;
    createMood: (mood: ShortMood) => void;
    updateMood: (moodId: string, mood: ShortMood) => void;
    deleteMood: (moodId: string) => void;
}

const InitialMoodSlice = {
    loading: false,
    success: false,
    errorMessage: "",
    monthMoodData: [] as Mood[],
    dayMoodData: [] as Mood[]
}

export const MoodStore: StateCreator<MoodSlice & UserSlice & CalendarSlice, [], [], MoodSlice> = (set, get) => ({
    ...InitialMoodSlice,

    fetchMood: async () => {
        const userId = get().currentUser.id;
        const selectedDate = get().selectedDate;

        if (!userId || !selectedDate) {
            set({ errorMessage: "User not logged in or date not selected" });
            return;
        }

        set({ loading: true });
        let response = await api.get<Mood[]>(`/Mood/${userId}/between-dates`, {
            params: {
                startDate: selectedDate.startOf("month").format("YYYY-MM-DD"),
                finishDate: selectedDate.endOf("month").format("YYYY-MM-DD")
            }
        });

        if (response.status == "error") {
            set({ errorMessage: response.error.message });
        }
        else {
            set({ success: true, monthMoodData: response.data });
        }

        response = await api.get<Mood[]>(`/Mood/${userId}/by-date`, {
            params: {
                date: selectedDate.startOf("day")
            }
        })

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
        }
        else {
            set({ loading: false, success: true, dayMoodData: response.data });
        }

    },

    createMood: async (mood) => {
        if (typeof (mood) == "undefined") {
            return;
        }
        set({ loading: true });
        const response = await api.post<ShortMood, Mood>(`/Mood`, mood);

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
            return;
        }

        set({ loading: false, success: true });
        get().fetchMood();
    },

    updateMood: async (moodId, mood) => {
        if (typeof (mood) == "undefined") return;

        set({ loading: true });
        const response = await api.post<ShortMood, Mood>(`/Health/${moodId}`, mood);

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
            return;
        }

        set({ loading: false, success: true });
        get().fetchMood();
    },

    deleteMood: async (moodId) => {
        set({ loading: true });
        const response = await api.del<void>(`/Mood/${moodId}`);

        if (response.status == "error") {
            set({ errorMessage: response.error.message, loading: false });
            return;
        }

        set({ loading: false, success: true });
        get().fetchMood();
    }
});
