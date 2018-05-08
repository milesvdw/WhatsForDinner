import * as Utils from "./utils.js";
export function isIngredientAvailable(ingredient, ingredients) {
    var ingredientInStock = ingredients.find(function (stockIngredient) {
        return Utils.compareIngredients(stockIngredient, ingredient);
    });
    return !!ingredientInStock;
}
