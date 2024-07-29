import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { RestMethod } from "../shared/types/RestMethod";
import { client } from "../shared/helpers/client";

type SuccessResponse<T> = { status: 'success'; data: T };
type ErrorResponse = { status: 'error'; error: string };
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

interface RequestParams<T> {
    method: RestMethod;
    url: string;
    data?: T;
    config?: AxiosRequestConfig;
}

export async function apiRequest<RequestData, ResponseData>(
    params: RequestParams<RequestData>
): Promise<ApiResponse<ResponseData>> {

    function restMethodToString(method: RestMethod): string {
        switch (method) {
            case RestMethod.Get:
                return 'GET';
            case RestMethod.Post:
                return 'POST';
            case RestMethod.Put:
                return 'PUT';
            case RestMethod.Delete:
                return 'DELETE';
            default:
                throw new Error('Unknown REST method');
        }
    }

    try {
        const response: AxiosResponse<ResponseData> = await client.request({
            method: typeof params.method === 'string' ? params.method : restMethodToString(params.method),
            url: params.url,
            data: params.data,
            ...params.config,
        });

        return { status: 'success', data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: 'error',
                error: error.response?.data?.message || error.message,
            };
        }
        return { status: 'error', error: 'An unexpected error occurred' };
    }
}

export const get = <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<never, T>({ method: RestMethod.Get, url, config });

export const post = <T, R>(url: string, data: T, config?: AxiosRequestConfig) =>
    apiRequest<T, R>({ method: RestMethod.Post, url, data, config });

export const put = <T, R>(url: string, data: T, config?: AxiosRequestConfig) =>
    apiRequest<T, R>({ method: RestMethod.Put, url, data, config });

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<never, T>({ method: RestMethod.Delete, url, config });
