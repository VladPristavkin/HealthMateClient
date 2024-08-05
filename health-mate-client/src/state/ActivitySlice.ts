import { StateCreator } from 'zustand'
import { UserSlice } from './UserSlice';
import * as api from '../api/genericApi';
import { CalendarSlice } from './CalendarSlice';
import { Activity, ShortActivity } from '../shared/types/Activity';

export interface ActivitySlice {
    loading: boolean;
    success: boolean;
    errorMessage: string;
    monthActivityData: Activity[];
    dayActivityData: Activity[];
    fetchActivity: () => void;
    createActivity: (activity: ShortActivity) => void;
    updateActivity: (activityId: string, activity: ShortActivity) => void;
    deleteActivity: (activityId: string) => void;
}

const InitialActivitySlice = {
    loading: false,
    success: false,
    errorMessage: "",
    monthActivityData: [] as Activity[],
    dayActivityData: [] as Activity[]
}

export const ActivityStore: StateCreator<ActivitySlice & UserSlice & CalendarSlice, [], [], ActivitySlice> = (set, get) => ({
    ...InitialActivitySlice,

    fetchActivity: async () => {
        const userId = get().currentUser.id;
        const selectedDate = get().selectedDate;

        if (!userId || !selectedDate) {
            set({ errorMessage: "User not logged in or date not selected" });
            return;
        }

        set({ loading: true });
        let response = await api.get<Activity[]>(`/Activity/${userId}/between-dates`, {
            params: {
                startDate: selectedDate.startOf("month").format("YYYY-MM-DD"),
                finishDate: selectedDate.endOf("month").format("YYYY-MM-DD")
            }
        });

        if (response.status == "error") {
            set({ errorMessage: response.error.message });
        }
        else {
            set({ success: true, monthActivityData: response.data });
        }

        response = await api.get<Activity[]>(`/Activity/${userId}/by-date`, {
            params: {
                date: selectedDate.startOf("day")
            }
        })

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
        }
        else {
            set({ loading: false, success: true, dayActivityData: response.data });
        }

    },

    createActivity: async (activity) => {
        if (typeof (activity) == "undefined") {
            return;
        }
        set({ loading: true });
        const response = await api.post<ShortActivity, Activity>(`/Activity`, activity);

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
            return;
        }

        set({ loading: false, success: true });
        get().fetchActivity();
    },

    updateActivity: async (activityId, activity) => {
        if (typeof (activity) == "undefined") return;

        set({ loading: true });
        const response = await api.post<ShortActivity, Activity>(`/Activity/${activityId}`, activity);

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
            return;
        }

        set({ loading: false, success: true });
        get().fetchActivity();
    },

    deleteActivity: async (activityId) => {
        set({ loading: true });
        const response = await api.del<void>(`/Activity/${activityId}`);

        if (response.status == "error") {
            set({ errorMessage: response.error.message, loading: false });
            return;
        }

        set({ loading: false, success: true });
        get().fetchActivity();
    }
});
