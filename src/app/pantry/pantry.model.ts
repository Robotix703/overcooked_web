export interface Pantry {
    _id: string
    ingredientID: string
    quantity: number
    expirationDate: Date
}

export interface IngredientInventory {
    ingredientID: string,
    ingredientName: string,
    ingredientImagePath: string,
    pantries: Pantry[]
}