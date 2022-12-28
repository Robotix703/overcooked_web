export interface Pantry {
    _id: string
    ingredientID: string
    quantity: number
    expirationDate: Date
    frozen: boolean
}

export interface IngredientInventory {
    ingredientID: string,
    ingredientName: string,
    ingredientImagePath: string,
    ingredientFreezable: boolean,
    pantries: Pantry[]
}