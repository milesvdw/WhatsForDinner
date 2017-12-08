//functions for interfacing with trello
var apiKey = "3be8b0531bfce673dc121b44fdc5de2c";
var apiToken = "03b2c8c82110e7ba7a1774620585e916d095d672531f5b93521910c8e04ecc46";
var keyTokenString = "key=" + apiKey + "&token=" + apiToken;
class Board {
}
class Ingredient {
    constructor() {
        this.name = "";
        this.quantity = "";
        this.due = "";
    }
}
class Recipe {
    constructor(init) {
        this.id = "0";
        this.materials = ko.observableArray([[new Ingredient()]]); //each top-level item represents a list of ingredients which may replace/substitute each other
        this.description = "";
        this.name = "";
        this.Save = (then) => {
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
        };
        Object.assign(this, init);
        if (init && !ko.isObservable(init.materials))
            this.materials = ko.observableArray(init.materials || []);
    }
    ParseIngredients() {
        var parsedMaterials = this.materials().map(function (ingredientRow) {
            var quantity = ingredientRow[0].quantity;
            var ingredients = ingredientRow[0].name.split(',');
            return ingredients.map(function (i) {
                return {
                    quantity: quantity,
                    name: i.trim(),
                    due: null
                };
            });
        }) || [];
        this.materials(parsedMaterials || []);
        return this;
    }
    UnparseIngredients() {
        this.materials(this.materials().map(function (material) {
            var combinedIngredient = material[0];
            combinedIngredient.name = material.map(function (ingredient) { return ingredient.name; }).join(', ');
            return [combinedIngredient];
        }));
        return this;
    }
}
var Trello;
(function (Trello) {
    function DeleteRecipe(id, then) {
        var url = "/recipes/delete/"
            + "?id="
            + id;
        simpleAjaxCall(url, then);
    }
    Trello.DeleteRecipe = DeleteRecipe;
    function GetBoard(boardID, then) {
        var url = "https://api.trello.com/1/boards/"
            + boardID
            + "?fields"
            + keyTokenString;
        simpleAjaxCall(url, then);
    }
    Trello.GetBoard = GetBoard;
    function GetBoardCards(boardID, then) {
        var url = "https://api.trello.com/1/boards/"
            + boardID
            + "/cards?"
            + keyTokenString;
        simpleAjaxCall(url, then);
    }
    Trello.GetBoardCards = GetBoardCards;
    function GetBoardLists(boardID, then) {
        var url = "https://api.trello.com/1/boards/"
            + boardID
            + "/lists?"
            + keyTokenString;
        simpleAjaxCall(url, then);
    }
    Trello.GetBoardLists = GetBoardLists;
    function GetListCards(listID, then) {
        var url = "https://api.trello.com/1/lists/"
            + listID
            + "/cards?"
            + keyTokenString;
        simpleAjaxCall(url, then);
    }
    Trello.GetListCards = GetListCards;
    function GetRecipes(then) {
        var url = "/recipes";
        simpleAjaxCall(url, then);
    }
    Trello.GetRecipes = GetRecipes;
    function simpleAjaxCall(url, then) {
        $.ajax({
            url: url,
            context: document.body,
            success: function (data) {
                then(data);
            },
            error: function (data) {
                console.log(data);
            }
        }).done(function () {
            return;
        });
    }
})(Trello || (Trello = {}));
