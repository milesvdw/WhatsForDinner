import * as Models from "./models.js";
import * as Utils from "./utils.js";

export function isIngredientAvailable(ingredient: Models.Ingredient, ingredients: Models.Ingredient[]): boolean {
    var ingredientInStock = ingredients.find(function (stockIngredient) {
        return Utils.compareIngredients(stockIngredient, ingredient);
    });
    return !!ingredientInStock
}