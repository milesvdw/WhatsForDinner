var foodBoard: string = "AysKIn90";
var foodInventoryTableId = "5a2059c7a009418e7e2c622c";


function isMaterialAvailable(material: Material, ingredients: Ingredient[] = vm.availableIngredients()): boolean {
    var match = material.find(function (ingredient) {
        return isIngredientAvailable(ingredient, ingredients)
    });
    return !!match;
}

function compareIngredients(a: Ingredient, b: Ingredient) {
    return a.name.toLowerCase() == b.name.toLowerCase()
        || a.name.toLowerCase() == b.name.toLowerCase() + 's'
        || a.name.toLowerCase() + 's' == b.name.toLowerCase();
}

function isIngredientAvailable(ingredient: Ingredient, ingredients: Ingredient[] = vm.availableIngredients()): boolean {
    var ingredientInStock = ingredients.find(function (stockIngredient) {
        return compareIngredients(stockIngredient, ingredient);
    });
    return !!ingredientInStock
}
function computePossibleRecipes(recipes: Recipe[], ingredients: Ingredient[]): Recipe[] {
    return recipes.filter(function (recipe: Recipe) {
        var missingMaterials = recipe.materials.filter(function (material: Material) {
            return !isMaterialAvailable(material, ingredients);
        });
        return !(missingMaterials.length > 0);
    });
}

function open_add_recipe

class ViewModel {



    availableIngredients = ko.observableArray([]);
    allRecipes = ko.observableArray([]);



    possibleRecipes = ko.computed(() => {
        return computePossibleRecipes(this.allRecipes(), this.availableIngredients());
    });
}

var vm = new ViewModel();


ko.applyBindings(vm);

Trello.GetListCards(foodInventoryTableId, function (cards) {
    vm.availableIngredients(cards);
});

Trello.GetRecipes(function (recipes) {
    vm.allRecipes(recipes)
})

function submit_add_recipe_form() {
    var newRecipe: Recipe = new Recipe({
            id: 0,
            name: $("#new_recipe #name").val() as string,
            description: $("#new_recipe #description").val() as string,
            materials: Recipe.ParseIngredients($("#new_recipe #ingredients").val() as string)
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