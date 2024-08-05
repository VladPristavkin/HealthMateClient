import { StateCreator } from 'zustand'
import { UserSlice } from './UserSlice';
import * as api from '../api/genericApi';
import { CalendarSlice } from './CalendarSlice';
import { Medication, ShortMedication } from '../shared/types/Medication';

export interface MedicationSlice {
    loading: boolean;
    success: boolean;
    errorMessage: string;
    monthMedicationData: Medication[];
    dayMedicationData: Medication[];
    fetchMedication: () => void;
    createMedication: (medication: ShortMedication) => void;
    updateMedication: (medicationId: string, medication: ShortMedication) => void;
    deleteMedication: (medicationId: string) => void;
}

const InitialMedicationSlice = {
    loading: false,
    success: false,
    errorMessage: "",
    monthMedicationData: [] as Medication[],
    dayMedicationData: [] as Medication[]
}

export const MedicationStore: StateCreator<MedicationSlice & UserSlice & CalendarSlice, [], [], MedicationSlice> = (set, get) => ({
    ...InitialMedicationSlice,

    fetchMedication: async () => {
        const userId = get().currentUser.id;
        const selectedDate = get().selectedDate;

        if (!userId || !selectedDate) {
            set({ errorMessage: "User not logged in or date not selected" });
            return;
        }

        set({ loading: true });
        let response = await api.get<Medication[]>(`/Medication/${userId}/between-dates`, {
            params: {
                startDate: selectedDate.startOf("month").format("YYYY-MM-DD"),
                finishDate: selectedDate.endOf("month").format("YYYY-MM-DD")
            }
        });

        if (response.status == "error") {
            set({ errorMessage: response.error.message });
        }
        else {
            set({ success: true, monthMedicationData: response.data });
        }

        response = await api.get<Medication[]>(`/Medication/${userId}/by-date`, {
            params: {
                date: selectedDate.startOf("day")
            }
        })

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
        }
        else {
            set({ loading: false, success: true, dayMedicationData: response.data });
        }

    },

    createMedication: async (medication) => {
        if (typeof (medication) == "undefined") {
            return;
        }
        set({ loading: true });
        const response = await api.post<ShortMedication, Medication>(`/Medication`, medication);

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
            return;
        }

        set({ loading: false, success: true });
        get().fetchMedication();
    },

    updateMedication: async (medicationId, medication) => {
        if (typeof (medication) == "undefined") return;

        set({ loading: true });
        const response = await api.post<ShortMedication, Medication>(`/Health/${medicationId}`, medication);

        if (response.status == "error") {
            set({ loading: false, errorMessage: response.error.message });
            return;
        }

        set({ loading: false, success: true });
        get().fetchMedication();
    },

    deleteMedication: async (medicationId) => {
        set({ loading: true });
        const response = await api.del<void>(`/Medication/${medicationId}`);

        if (response.status == "error") {
            set({ errorMessage: response.error.message, loading: false });
            return;
        }

        set({ loading: false, success: true });
        get().fetchMedication();
    }
});
