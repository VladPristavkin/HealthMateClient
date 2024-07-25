import axios from 'axios';
import { HealthData } from '../moduls/Health/interfaces/HealthData';

const api = axios.create({
    baseURL: "https://localhost:7257/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

export const healthApi = {
    getHealthByDate: async (userId: string, date: string): Promise<HealthData[]> => {
        const response = await api.get<HealthData[]>(`/Health/${userId}/by-date`,
            {
                params: { date }
            }
        );
        return response.data;
    },

    getHealthBetweenDates: async (userId: string, startDate: string, finishDate: string): Promise<HealthData[]> => {
        const response = await api.get<HealthData[]>(`/Health/${userId}/between-dates`,
            {
                params: { startDate, finishDate }
            }
        );
        return response.data;
    },

    addHealth: async (health: Omit<HealthData, 'id'>): Promise<HealthData> => {
        const response = await api.post<HealthData>('/Health', health);
        return response.data;
    },

    updateHealth: async (health: HealthData): Promise<HealthData> => {
        const response = await api.put<HealthData>(`/Health/${health.id}`, health);
        return response.data;
    },

    deleteHealthd: async (id: string): Promise<void> => {
        await api.delete(`/Health/${id}`);
    },
};