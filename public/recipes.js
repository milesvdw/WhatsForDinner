var foodBoard = "AysKIn90";
var foodInventoryTableId = "5a2059c7a009418e7e2c622c";
function isMaterialAvailable(material, ingredients = vm.availableIngredients()) {
    var match = material.find(function (ingredient) {
        return isIngredientAvailable(ingredient, ingredients);
    });
    return !!match;
}
function isIngredientAvailable(ingredient, ingredients = vm.availableIngredients()) {
    var ingredientInStock = ingredients.find(function (stockIngredient) {
        return stockIngredient.name.toLowerCase() == ingredient.name.toLowerCase();
    });
    return !!ingredientInStock;
}
function computePossibleRecipes(recipes, ingredients) {
    return recipes.filter(function (recipe) {
        var missingMaterials = recipe.materials.filter(function (material) {
            return !isMaterialAvailable(material, ingredients);
        });
        return !(missingMaterials.length > 0);
    });
}
class ViewModel {
    constructor() {
        this.availableIngredients = ko.observableArray([]);
        this.allRecipes = ko.observableArray([]);
        this.possibleRecipes = ko.computed(() => {
            return computePossibleRecipes(this.allRecipes(), this.availableIngredients());
        });
    }
}
var vm = new ViewModel();
ko.applyBindings(vm);
Trello.GetListCards(foodInventoryTableId, function (cards) {
    vm.availableIngredients(cards);
});
Trello.GetRecipes(function (recipes) {
    vm.allRecipes(recipes);
});
function submit_add_recipe_form() {
    var newRecipe = new Recipe({
        id: 0,
        name: $("#new_recipe #name").val(),
        description: $("#new_recipe #description").val(),
        materials: Recipe.ParseIngredients($("#new_recipe #ingredients").val())
    });
    $("#new_recipe #name").val("");
    $("#new_recipe #description").val("");
    $("#new_recipe #ingredients").val("");
    $("#add_recipe_header").click();
    newRecipe.Save(function () {
        vm.allRecipes.push(newRecipe);
    });
    return false;
}
