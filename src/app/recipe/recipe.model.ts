import { PrettyInstruction } from "../instruction/instruction.model";

export interface Recipe {
  _id: string
  title: string
  numberOfLunch: number
  imagePath: string
  category: string
  duration: number
  lastCooked: Date | undefined | string
  composition: string | null
  tags: string[]
}

export interface PrettyRecipe {
  _id: string
  title: string
  numberOfLunch: number
  category: string
  duration: number
  instructions: PrettyInstruction[],
  tagsId: string[]
}

export const categoriesRecipe = [
  "Entrée",
  "Plat",
  "Dessert"
]
