var foodBoard = "AysKIn90";
var foodInventoryTableId = "5a2059c7a009418e7e2c622c";
function isMaterialAvailable(material, ingredients = vm.availableIngredients()) {
    var match = material.ingredients.find(function (ingredient) {
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
    return fuzzyCompare(str1, str2, 's') || fuzzyCompare(str1, str2, 'es') || fuzzyCompare(str1, str2, 'cooked');
}
function isIngredientAvailable(ingredient, ingredients = vm.availableIngredients()) {
    var ingredientInStock = ingredients.find(function (stockIngredient) {
        return compareIngredients(stockIngredient, ingredient);
    });
    return !!ingredientInStock;
}
function computePossibleRecipes(recipes, ingredients) {
    return recipes.filter(function (recipe) {
        var missingMaterials = recipe.materials().filter(function (material) {
            return material.required && !isMaterialAvailable(material, ingredients);
        });
        return !(missingMaterials.length > 0);
    });
}
function remove_row(row) {
    $(row).closest('.row').remove();
}
function print_material(material) {
    var quantity = material.quantity ? material.quantity + ' ' : '';
    var ingredients = material.ingredients.map(function (ingredient) { return ingredient.name; }).join('or ');
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
    vm.allRecipes(recipes.map(function (recipe) { return new Recipe(recipe); }));
    vm.allRecipes.sort(function (r1, r2) { return r1.name.localeCompare(r2.name); });
});
function save_recipe() {
    var newRecipe = vm.add_edit_recipe().ParseIngredients();
    newRecipe.Save(function (data) {
        if (newRecipe.id != "0") {
            if (data.id != newRecipe.id)
                console.log("ERROR: Saved id not equal to id sent!");
            var toRemove = vm.allRecipes().find(function (recipe) { return recipe.id == data.id; });
            vm.allRecipes.remove(toRemove);
        }
        newRecipe.id = data.id;
        vm.allRecipes.push(new Recipe(newRecipe));
        vm.allRecipes.sort(function (r1, r2) { return r1.name.localeCompare(r2.name); });
    });
    vm.add_edit_recipe(new Recipe());
    return false;
}
