export interface Meal {
    _id: string
    recipeID: string
    numberOfLunchPlanned: number
}

export interface PrettyMeal {
    _id: string,
    title: string,
    numberOfLunch: number,
    imagePath: string,
    state: boolean,
    background: string,
    missingIngredients: {
        ingredientName: string,
        quantity: number,
        unitOfMeasure: string
    }[]
}

export interface stateMeal {
    _id: string,
    title: string,
    numberOfLunch: number,
    imagePath: string,
    state: {
        ingredientAvailable: any,
        ingredientAlmostExpire: any,
        ingredientUnavailable: any
    },
    background: string
}