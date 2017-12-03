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
        return raw_ingredients.split('\n').map(function (interchangable_ingredients) {
            return interchangable_ingredients.split(',').map(function (ingredient) {
                return {
                    name: ingredient,
                    due: null
                };
            });
        });
    }
}
var Trello;
(function (Trello) {
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
