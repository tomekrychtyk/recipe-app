import { Nutrients } from "./nutrients";

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  nutrients: Nutrients;
}
