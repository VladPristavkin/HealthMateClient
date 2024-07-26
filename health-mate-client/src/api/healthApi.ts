import axios from 'axios';
import { HealthType } from '../shared/types/HealthType';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const healthApi = {
    getHealthByDate: async (userId: string, date: string): Promise<HealthType[]> => {
        const response = await api.get<HealthType[]>(`/Health/${userId}/by-date`,
            {
                params: { date }
            }
        );
        return response.data;
    },

    getHealthBetweenDates: async (userId: string, startDate: string, finishDate: string): Promise<HealthType[]> => {
        const response = await api.get<HealthType[]>(`/Health/${userId}/between-dates`,
            {
                params: { startDate, finishDate }
            }
        );
        return response.data;
    },

    addHealth: async (health: Omit<HealthType, 'id'>): Promise<HealthType> => {
        const response = await api.post<HealthType>('/Health', health);
        return response.data;
    },

    updateHealth: async (health: HealthType): Promise<HealthType> => {
        const response = await api.put<HealthType>(`/Health/${health.id}`, health);
        return response.data;
    },

    deleteHealth: async (id: string): Promise<void> => {
        await api.delete(`/Health/${id}`);
    },
};