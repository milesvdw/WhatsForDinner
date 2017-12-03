//functions for interfacing with trello
var apiKey: string = "3be8b0531bfce673dc121b44fdc5de2c";
var apiToken: string = "03b2c8c82110e7ba7a1774620585e916d095d672531f5b93521910c8e04ecc46";
var keyTokenString: string = "key=" + apiKey + "&token=" + apiToken;

class Board {

}

class Ingredient {
    name: string;
    due: string;
}

type Material = Ingredient[];

class Recipe {
    id: number;
    materials: Material[]; //each top-level item represents a list of ingredients which may replace/substitute each other
    description: string;
    name: string;

    public static ParseIngredients(raw_ingredients: string): Material[] {
        return raw_ingredients.split('\n').map(function (interchangable_ingredients: string) {
            return interchangable_ingredients.split(',').map(function (ingredient) {
                return { 
                    name: ingredient,
                    due: null
                };
            });
        });
    }

    public constructor(init?: Partial<Recipe>) {
        Object.assign(this, init);
    }

    public Save = (then: Function): void => {
        $.ajax({
            url: "/recipes",
            dataType: "json",
            data: {
                id: 0,
                materials: this.materials,
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
}


namespace Trello {
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