import { StateCreator } from 'zustand'
import { Health, ShortHealth } from '../shared/types/Health';
import { UserSlice } from './UserSlice';
import * as api from '../api/genericApi';
import { CalendarSlice } from './CalendarSlice';

export interface HealthSlice {
    loading: boolean;
    success: boolean;
    errorMessage: string;
    monthHealthData: Health[];
    dayHealthData: Health[];
    fetchHealth: () => void;
    createHealth: (health: ShortHealth) => void;
    updateHealth: (healthId: string, health: ShortHealth) => void;
    deleteHealth: (healthId: string) => void;
}

const InitialHealthSlice = {
    loading: false,
    success: false,
    errorMessage: "",
    monthHealthData: [] as Health[],
    dayHealthData: [] as Health[]
}

export const HealthStore: StateCreator<HealthSlice & UserSlice & CalendarSlice, [], [], HealthSlice> = (set, get) => ({
    ...InitialHealthSlice,

    fetchHealth: async () => {
        const userId = get().currentUser.id;
        const selectedDate = get().selectedDate;

        if (!userId || !selectedDate) {
            set({ errorMessage: "User not logged in or date not selected" });
            return;
        }

        set({ loading: true });
        let response = await api.get<Health[]>(`/Health/${userId}/between-dates`, {
            params: {
                startDate: selectedDate.startOf("month").format("YYYY-MM-DD"),
                finishDate: selectedDate.endOf("month").format("YYYY-MM-DD")
            }
        });

        if (response.status == "error") {
            set({ errorMessage: response.error.message });
        }
        else {
            set({ success: true, monthHealthData: response.data });
        }

        response = await api.get<Health[]>(`/Health/${userId}/by-date`, {
            params: {
                date: selectedDate.startOf("day")
            }
        })

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
        }
        else {
            set({ loading: false, success: true, dayHealthData: response.data });
        }
    },

    createHealth: async (health) => {
        if (typeof (health) == "undefined") {
            return;
        }
        set({ loading: true });
        const response = await api.post<ShortHealth, Health>(`/Health`, health);

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
            return;
        }

        set({ loading: false, success: true });
        get().fetchHealth();
    },

    updateHealth: async (healthId, health) => {
        if (typeof (health) == "undefined") return;

        set({ loading: true });
        const response = await api.post<ShortHealth, Health>(`/Health/${healthId}`, health);

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
            return;
        }

        set({ loading: false, success: true });
        get().fetchHealth();
    },

    deleteHealth: async (healthId) => {
        set({ loading: true });
        const response = await api.del<void>(`/Health/${healthId}`);

        if (response.status == "error") {
            set({ errorMessage: response.error.message, loading: false });
            return;
        }

        set({ loading: false, success: true });
        get().fetchHealth();
    }
});
