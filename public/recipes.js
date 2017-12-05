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
function add_recipe_add_ingredient_row() {
    $("#add_recipe_add_ingredient_location").before(`
        <div class="row add_recipe_ingredient_row">
            <div class="col-sm-2">
                <input type="text" class="ingredient_qty form-control" />
            </div>
            <div class="col-sm-9">
                <input type="text" class="ingredient_name form-control" />
            </div>
            <div class="col-sm-1">
                    &nbsp;<a class="glyphicon glyphicon-remove-circle glyph-center glyph-button" onclick="remove_row(this)"></a>
            </div>
        </div>
        `);
}
function remove_row(element) {
    $(element).closest(".row").fadeOut(function () { $(this).remove(); });
}
function delete_recipe(id) {
    Trello.DeleteRecipe(id, function (data) { console.log(data); });
    vm.allRecipes.remove(function (recipe) {
        return recipe.id == id;
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
    var newRecipe = new Recipe({
        id: 0,
        name: $("#new_recipe #name").val(),
        description: $("#new_recipe #description").val(),
        materials: Recipe.ParseIngredients($("#new_recipe #ingredients").val())
    });
    $("#new_recipe #name").val("");
    $("#new_recipe #description").val("");
    $("#new_recipe .add_recipe_ingredient_row").not(':first').remove();
    $("#new_recipe .add_recipe_ingredient_row input").val("");
    $("#add_recipe_header").click();
    newRecipe.Save(function () {
        vm.allRecipes.push(newRecipe);
    });
    return false;
}
