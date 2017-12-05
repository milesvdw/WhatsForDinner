//functions for interfacing with trello
var apiKey = "3be8b0531bfce673dc121b44fdc5de2c";
var apiToken = "03b2c8c82110e7ba7a1774620585e916d095d672531f5b93521910c8e04ecc46";
var keyTokenString = "key=" + apiKey + "&token=" + apiToken;
class Board {
}
class Ingredient {
}
class Recipe {
    constructor(init) {
        this.Save = (then) => {
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
        };
        Object.assign(this, init);
    }
    static ParseIngredients(raw_ingredients) {
        var ingredientRows = $(".add_recipe_ingredient_row");
        var materials = ingredientRows.toArray().map(function (ingredientRow) {
            var quantity = $(ingredientRow).find(".ingredient_qty").val();
            var ingredients = $(ingredientRow).find(".ingredient_name").val().split(',');
            return ingredients.map(function (i) {
                return {
                    quantity: quantity,
                    name: i.trim(),
                    due: null
                };
            });
        });
        return materials;
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
