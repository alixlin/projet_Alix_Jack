import {Meal} from "./Meal";

export interface AppUser {
  email: string;
  password: string;
  roles : String[];
  cart: Meal[];
  favorite: Meal[];
}
