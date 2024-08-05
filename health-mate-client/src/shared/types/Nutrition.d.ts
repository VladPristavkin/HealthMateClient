import { FoodItem } from "./FoodItem";
import { MealType } from "./MealType";
import { Note } from "./Note";

export type Nutrition = {
    id: string;
    mealType: MealType;
    calories: number;
    foodItems: FoodItem[];
    date: string;
    notes: Note[];
}

export type ShortNutrition = {
    userId: string;
    mealType: MealType;
    calories: number;
    foodItems: FoodItem[];
    date: string;
    notes: Note[];
}
