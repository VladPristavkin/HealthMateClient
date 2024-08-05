import { Gender } from "./Gender";

export type User = {
    id: string;
    name: string;
    userName: string;
    email: string;
    dateOfBirth: string;
    gender: Gender;
    height: number;
    weight: number;
}

export type ShortUser = {
    name: string;
    userName: string;
    email: string;
    dateOfBirth: string;
    genderId: string;
    height: number;
    weight: number;
}
