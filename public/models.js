import * as Recipes from "./recipes.js";
//functions for interfacing with trello
var apiKey = "3be8b0531bfce673dc121b44fdc5de2c";
var apiToken = "03b2c8c82110e7ba7a1774620585e916d095d672531f5b93521910c8e04ecc46";
var keyTokenString = "key=" + apiKey + "&token=" + apiToken;
export class Board {
}
export class Ingredient {
    constructor(init) {
        this.name = "";
        this.category = "";
        this.status = "archived";
        Object.assign(this, init);
    }
    Save(then) {
        $.ajax({
            url: "/inventory",
            dataType: "json",
            data: ko.toJS(this),
            method: 'post'
        }).then((data) => {
            console.log(data);
        }, (data) => {
            console.log(data);
        }).then((data) => { return then(data); });
    }
    ;
}
export class Material {
    constructor(init) {
        this.ingredients = [new Ingredient()];
        this.quantity = "";
        this.required = true;
        Object.assign(this, init);
    }
    isAvailable(ingredients) {
        return this.ingredients.some(function (ingredient) {
            return Recipes.isIngredientAvailable(ingredient, ingredients);
        });
    }
    print() {
        var quantity = this.quantity ? this.quantity + ' ' : '';
        var ingredients = this.ingredients.map(function (ingredient) { return ingredient.name; }).join(' or ');
        return quantity + ingredients;
    }
}
;
export class Recipe {
    constructor(init) {
        this.id = "0";
        this.materials = ko.observableArray([new Material()]); //each top-level item represents a list of ingredients which may replace/substitute each other
        this.description = "";
        this.name = "";
        this.Save = (then) => {
            $.ajax({
                url: "/recipes",
                dataType: "json",
                data: ko.toJS(this),
                method: 'post',
                success: function (data) {
                    console.log(data);
                    this.id = data.id;
                    then(data);
                },
                error: function (data) {
                    console.log(data);
                }
            }).done(function () {
                return;
            });
        };
        Object.assign(this, init);
        //make sure materials have been constructed (this is only an issue if they just came from the database)
        if (init && !ko.isObservable(init.materials))
            this.materials = ko.observableArray(this.materials.map((m) => {
                return new Material(m);
            }) || []);
        //clean up materials
        this.materials().forEach(function (material) {
            material.required = material.required === true || material.required == 'true'; //unfortunate hack due to the fact that values are stored in the database as strings.
        });
    }
    ParseIngredients() {
        var parsedMaterials = this.materials().map(function (ingredientRow) {
            var quantity = ingredientRow.quantity;
            var ingredients = ingredientRow.ingredients[0].name.split(',');
            var required = ingredientRow.required;
            return new Material({
                ingredients: ingredients.map(function (i) {
                    return new Ingredient({
                        name: i.trim()
                    });
                }),
                quantity: quantity,
                required: required
            });
        }) || [];
        this.materials(parsedMaterials || []);
        return this;
    }
    UnparseIngredients() {
        this.materials(this.materials().map(function (material) {
            var combinedIngredient = material.ingredients[0];
            combinedIngredient.name = material.ingredients.map(function (ingredient) { return ingredient.name; }).join(', ');
            return new Material({
                ingredients: [combinedIngredient],
                quantity: material.quantity,
                required: material.required
            });
        }));
        return this;
    }
}
