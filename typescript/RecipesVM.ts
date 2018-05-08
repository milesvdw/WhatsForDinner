import * as Recipes from "./recipes.js";
import * as Models from "./models.js";
import * as Trello from "./trello.js";
import * as Database from "./database.js";

class RecipeViewModel {


    public add_edit_recipe = ko.observable(new Models.Recipe());
    public availableIngredients = ko.observableArray([] as Models.Ingredient[]);
    public allRecipes = ko.observableArray([] as Models.Recipe[]);



    public possibleRecipes = ko.computed(() => {
        return this.computePossibleRecipes(this.allRecipes(), this.availableIngredients());
    });

    public computePossibleRecipes(recipes: Models.Recipe[], ingredients: Models.Ingredient[]): Models.Recipe[] {
        return recipes.filter(function (recipe: Models.Recipe) {
            var missingMaterials = recipe.materials().filter(function (material: Models.Material) {
                return material.required && !material.isAvailable(ingredients);
            });
            return !(missingMaterials.length > 0);
        });
    }

    public delete_recipe(id) {
        Database.DeleteRecipe(id, function (data) { console.log(data) });
        vm.allRecipes.remove(function (recipe: Models.Recipe) {
            return recipe.id == id;
        });
    }
    
    public edit_recipe(id) {
        vm.add_edit_recipe(vm.allRecipes().find(function (recipe) { return recipe.id == id; }).UnparseIngredients());
    }
    
    public save_recipe() {
        var newRecipe: Models.Recipe = vm.add_edit_recipe().ParseIngredients();
    
        newRecipe.Save(function (data) {
            if (newRecipe.id != "0") {
                if (data.id != newRecipe.id) console.log("ERROR: Saved id not equal to id sent!");
                var toRemove = vm.allRecipes().find(function (recipe) { return recipe.id == data.id });
                vm.allRecipes.remove(toRemove);
            }
            newRecipe.id = data.id;
            vm.allRecipes.push(new Models.Recipe(newRecipe));
            vm.allRecipes.sort(function (r1, r2) { return r1.name.localeCompare(r2.name) });
        });
    
        vm.add_edit_recipe(new Models.Recipe());
    
        return false;
    }
}

let vm = new RecipeViewModel();

ko.applyBindings(vm);

$("body").on("mouseover mouseout", '.recipe-row .btn', function () {
    $(this).toggleClass('active');
});

Trello.GetListCards(Trello.foodInventoryTableId, function (cards) {
    vm.availableIngredients(cards);
});

Database.GetRecipes(function (recipes) {
    vm.allRecipes(recipes.map(function (recipe) { return new Models.Recipe(recipe) }));
    vm.allRecipes.sort(function (r1, r2) { return r1.name.localeCompare(r2.name) })
});



