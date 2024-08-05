import { StateCreator } from "zustand";
import { ShortUser, User } from "../shared/types/User";
import * as api from '../api/genericApi'

export interface UserSlice {
    loading: boolean;
    success: boolean;
    errorMessage: string;
    currentUser: User;
    createUser: (user: ShortUser) => void;
    getUserById: (userId: string) => Promise<User>;
    updateUser: (userId: string, user: ShortUser) => void;
    deleteUser: (userId: string) => void;
}

const InitialUserSlice = {
    loading: false,
    success: false,
    errorMessage: "",
    currentUser: {} as User,
}

export const UserStore: StateCreator<UserSlice, [], [], UserSlice> = (set, get) => ({
    ...InitialUserSlice,

    createUser: async (user) => {
        if (typeof (user) == "undefined") set({ currentUser: {} as User })

        set({ loading: true });
        const response = await api.post<ShortUser, User>(`/User`, user);

        if (response.status == "error") {
            set({ errorMessage: response.error.message, loading: false })
            return;
        }

        set({ currentUser: response.data, loading: false, success: true })
    },

    getUserById: async (userId) => {
        set({ loading: true });
        const response = await api.get<User>(`/User/${userId}`);

        if (response.status == "error") {
            set({ errorMessage: response.error.message, loading: false })
            return {} as User;
        }

        set({ loading: false, success: true });
        return response.data;
    },
    
    updateUser: async (userId, user) => {
        if (typeof (user) == "undefined") return;

        set({ loading: true });
        const response = await api.put<ShortUser, User>(`/User/${userId}`, user);

        if (response.status == "error") {
            set({ errorMessage: response.error.message, loading: false });
            return;
        }

        set({ loading: false, success: true, currentUser: response.data });
    },

    deleteUser: async (userId) => {
        set({ loading: true });
        const response = await api.del<void>(`/User/${userId}`);

        if (response.status == "error") {
            set({ errorMessage: response.error.message, loading: false });
            return;
        }

        set({ loading: false, success: true, currentUser: {} as User });
    },
});
