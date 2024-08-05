import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { CalendarSlice, CalendarStore } from "./CalendarSlice";
import { HealthSlice, HealthStore } from "./HealthSlice";
import { UserSlice, UserStore } from "./UserSlice";
import { ActivitySlice, ActivityStore } from "./ActivitySlice";
import { MedicationSlice, MedicationStore } from "./MedicationSlice";
import { MoodSlice, MoodStore } from "./MoodSlice";
import { NutritionSlice, NutritionStore } from "./NutritionSlice";

export const sliceResetFns = new Set<() => void>();

export const resetGlobalStore = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn();
  });
};

interface GlobalStoreState
  extends ActivitySlice,
  CalendarSlice,
  HealthSlice,
  MedicationSlice,
  MoodSlice,
  NutritionSlice,
  UserSlice { }

export const useGlobalStore = create<GlobalStoreState>()(
  devtools(
    persist(
      (...a) => ({
        ...ActivityStore(...a),
        ...CalendarStore(...a),
        ...HealthStore(...a),
        ...MedicationStore(...a),
        ...MoodStore(...a),
        ...NutritionStore(...a),
        ...UserStore(...a),
      }),
      {
        name: "app-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
