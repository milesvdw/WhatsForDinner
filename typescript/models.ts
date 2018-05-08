import * as Recipes from "./recipes.js"

//functions for interfacing with trello
var apiKey: string = "3be8b0531bfce673dc121b44fdc5de2c";
var apiToken: string = "03b2c8c82110e7ba7a1774620585e916d095d672531f5b93521910c8e04ecc46";
var keyTokenString: string = "key=" + apiKey + "&token=" + apiToken;

export class Board {

}

export class Ingredient {
    name: string = "";
    category: string = "";
    last_purchased: any; //TODO: figure out what this should be
    expires: boolean;
    shelf_life: number;
    status: string = "archived";

    public constructor(init?: Partial<Ingredient>) {
        Object.assign(this, init);
    }

    public Save (then: Function): void {
        $.ajax({
            url: "/inventory",
            dataType: "json",
            data: ko.toJS(this),
            method: 'post'
        }).then((data) => {
            console.log(data);
        }, (data) => {
            console.log(data);
        }).then((data) => {return then(data) });
    };
}

export class Material {
    public ingredients: Ingredient[] = [new Ingredient()];
    public quantity: string = "";
    public required: boolean = true;

    public constructor(init?: Partial<Material>) {
        Object.assign(this, init);
    }

    public isAvailable(ingredients: Ingredient[]): boolean {
        return this.ingredients.some(function (ingredient) {
            return Recipes.isIngredientAvailable(ingredient, ingredients)
        });
    }

    public print() {
        var quantity: string = this.quantity ? this.quantity + ' ' : '';
        var ingredients = this.ingredients.map(function (ingredient) { return ingredient.name }).join(' or ');
        return quantity + ingredients;
    }
};

export class Recipe {
    id: string = "0";
    materials: KnockoutObservableArray<Material> = ko.observableArray([new Material()]); //each top-level item represents a list of ingredients which may replace/substitute each other
    description: string = "";
    name: string = "";

    public constructor(init?: Partial<Recipe>) {
        Object.assign(this, init);


        //make sure materials have been constructed (this is only an issue if they just came from the database)
        if (init && !ko.isObservable(init.materials))
            this.materials = ko.observableArray(this.materials.map((m) => {
                return new Material(m)
            }) || []);

        //clean up materials
        this.materials().forEach(function (material) {
            material.required = material.required === true || material.required as any == 'true'; //unfortunate hack due to the fact that values are stored in the database as strings.
        });
    }

    public Save = (then: Function): void => {
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
    }

    ParseIngredients(): Recipe {
        var parsedMaterials: Material[] = this.materials().map(function (ingredientRow) { //TODO: I think there ought to be a better way to map the selector to the list than this...
            var quantity: string = ingredientRow.quantity;
            var ingredients: string[] = ingredientRow.ingredients[0].name.split(',');
            var required: boolean = ingredientRow.required;

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

    UnparseIngredients(): Recipe {
        this.materials(this.materials().map(function (material: Material) {
            var combinedIngredient: Ingredient = material.ingredients[0];
            combinedIngredient.name = material.ingredients.map(function (ingredient) { return ingredient.name }).join(', ');
            return new Material({
                ingredients: [combinedIngredient],
                quantity: material.quantity,
                required: material.required
            });
        }));
        return this;
    }
}