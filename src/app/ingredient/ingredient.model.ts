export interface Ingredient {
  _id: string
  name: string
  imagePath: string
  consumable: boolean,
  unitOfMeasure: string,
  shelfLife: number,
  freezable: boolean
}

export const categories = [
  "Viande",
  "Légumes",
  "Céréaliers",
  "Produit Laitier",
  "Matière grasse",
  "Autres"
]

export const unitOfMeasures = [
  "pc",
  "g",
  "L",
  "cL",
  "cs",
  "cc"
]
