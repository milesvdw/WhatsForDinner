//functions for interfacing with trello
var apiKey: string = "3be8b0531bfce673dc121b44fdc5de2c";
var apiToken: string = "03b2c8c82110e7ba7a1774620585e916d095d672531f5b93521910c8e04ecc46";
var keyTokenString: string = "key=" + apiKey + "&token=" + apiToken;

class Board {

}

class Ingredient {
    name: string = "";
    quantity: string = "";
    due: string = "";
}

type Material = Ingredient[];

class Recipe {
    id: string = "0";
    materials: KnockoutObservableArray<Material> = ko.observableArray([[new Ingredient()]] as Material[]); //each top-level item represents a list of ingredients which may replace/substitute each other
    description: string = "";
    name: string = "";

    public constructor(init?: Partial<Recipe>) {
        Object.assign(this, init);
        if (init && !ko.isObservable(init.materials)) this.materials = ko.observableArray(init.materials as Material[] || []);
    }

    public Save = (then: Function): void => {
        $.ajax({
            url: "/recipes",
            dataType: "json",
            data: {
                id: this.id,
                materials: this.materials(),
                description: this.description,
                name: this.name
            },
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
            var quantity: string = ingredientRow[0].quantity;
            var ingredients: string[] = ingredientRow[0].name.split(',');

            return ingredients.map(function (i) {
                return {
                    quantity: quantity,
                    name: i.trim(),
                    due: null
                } as Ingredient
            });
        }) || [];
        this.materials(parsedMaterials || []);
        return this;
    }

    UnparseIngredients(): Recipe {
        this.materials(this.materials().map(function (material) {
            var combinedIngredient: Ingredient = material[0];
            combinedIngredient.name = material.map(function (ingredient) { return ingredient.name }).join(', ');
            return [combinedIngredient]
        }));
        return this;
    }
}


namespace Trello {
    export function DeleteRecipe(id, then) {
        var url: string = "/recipes/delete/"
            + "?id="
            + id;
        simpleAjaxCall(url, then);
    }

    export function GetBoard(boardID: string, then: Function): void {
        var url: string = "https://api.trello.com/1/boards/"
            + boardID
            + "?fields"
            + keyTokenString;
        simpleAjaxCall(url, then);
    }

    export function GetBoardCards(boardID: string, then: Function): void {
        var url: string = "https://api.trello.com/1/boards/"
            + boardID
            + "/cards?"
            + keyTokenString;
        simpleAjaxCall(url, then);
    }

    export function GetBoardLists(boardID: string, then: Function): void {
        var url: string = "https://api.trello.com/1/boards/"
            + boardID
            + "/lists?"
            + keyTokenString;
        simpleAjaxCall(url, then);
    }

    export function GetListCards(listID: string, then: Function): void {
        var url: string = "https://api.trello.com/1/lists/"
            + listID
            + "/cards?"
            + keyTokenString;
        simpleAjaxCall(url, then);
    }

    export function GetRecipes(then: Function) {
        var url: string = "/recipes";
        simpleAjaxCall(url, then);
    }

    function simpleAjaxCall(url, then) {
        $.ajax({
            url: url,
            context: document.body,
            success: function (data) {
                then(data as Board);
            },
            error: function (data) {
                console.log(data);
            }
        }).done(function () {
            return;
        });
    }
}