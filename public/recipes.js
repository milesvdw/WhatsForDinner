var foodBoard = "AysKIn90";
var foodInventoryTableId = "5a2059c7a009418e7e2c622c";
function isMaterialAvailable(material, ingredients = vm.availableIngredients()) {
    var match = material.find(function (ingredient) {
        return isIngredientAvailable(ingredient, ingredients);
    });
    return !!match;
}
function fuzzyCompare(str1, str2, fuzz) {
    return str1 == str2 || str1 == str2 + fuzz || str1 + fuzz == str2;
}
function compareIngredients(a, b) {
    var str1 = a.name.replace(' ', '').toLowerCase();
    var str2 = b.name.replace(' ', '').toLowerCase();
    return fuzzyCompare(str1, str2, 's') || fuzzyCompare(str1, str2, 'cooked');
}
function isIngredientAvailable(ingredient, ingredients = vm.availableIngredients()) {
    var ingredientInStock = ingredients.find(function (stockIngredient) {
        return compareIngredients(stockIngredient, ingredient);
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
function remove_row(material) {
    var index = vm.add_edit_recipe().materials.indexOf(material);
    if (index > -1) {
        vm.add_edit_recipe().materials.splice(index, 1);
    }
}
function print_material(material) {
    var quantity = material[0].quantity ? material[0].quantity + ' ' : '';
    var ingredients = material.map(function (ingredient) { return ingredient.name; }).join('or ');
    return quantity + ingredients;
}
function delete_recipe(id) {
    Trello.DeleteRecipe(id, function (data) { console.log(data); });
    vm.allRecipes.remove(function (recipe) {
        return recipe.id == id;
    });
}
function edit_recipe(id) {
    vm.add_edit_recipe(vm.allRecipes().find(function (recipe) { return recipe.id == id; }).UnparseIngredients());
}
class ViewModel {
    constructor() {
        this.add_edit_recipe = ko.observable(new Recipe());
        this.availableIngredients = ko.observableArray([]);
        this.allRecipes = ko.observableArray([]);
        this.possibleRecipes = ko.computed(() => {
            return computePossibleRecipes(this.allRecipes(), this.availableIngredients());
        });
    }
}
var vm = new ViewModel();
ko.applyBindings(vm);
$("body").on("mouseover mouseout", '.recipe-row .btn', function () {
    $(this).toggleClass('active');
});
Trello.GetListCards(foodInventoryTableId, function (cards) {
    vm.availableIngredients(cards);
});
Trello.GetRecipes(function (recipes) {
    vm.allRecipes(recipes);
});
function submit_add_recipe_form() {
    var newRecipe = vm.add_edit_recipe().ParseIngredients();
    newRecipe.Save(function () {
        vm.allRecipes.push(new Recipe(newRecipe));
    });
    vm.add_edit_recipe(new Recipe());
    return false;
}
