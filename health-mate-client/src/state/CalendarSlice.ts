import dayjs from "dayjs";
import { StateCreator } from "zustand";

export interface CalendarSlice {
    errorMessage: string;
    selectedDate: dayjs.Dayjs;
    setSelectedDate: (date: dayjs.Dayjs) => void;
    clearSelectedDate: () => void;
}

const InitialCalendarSlice = {
    errorMessage: "",
    selectedDate: dayjs(),
}

export const CalendarStore: StateCreator<CalendarSlice, [], [], CalendarSlice> = (set, get) => ({
    ...InitialCalendarSlice,

    setSelectedDate: (date: dayjs.Dayjs) => set({ selectedDate: date }),

    clearSelectedDate: () => set({ selectedDate: dayjs() }),
});
