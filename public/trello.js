import * as Utils from "./utils.js";
var apiKey = "3be8b0531bfce673dc121b44fdc5de2c";
var apiToken = "03b2c8c82110e7ba7a1774620585e916d095d672531f5b93521910c8e04ecc46";
var keyTokenString = "key=" + apiKey + "&token=" + apiToken;
export let foodBoard = "AysKIn90";
export let foodInventoryTableId = "5a2059c7a009418e7e2c622c";
export function GetBoard(boardID, then) {
    var url = "https://api.trello.com/1/boards/"
        + boardID
        + "?fields"
        + keyTokenString;
    Utils.simpleAjaxCall(url, then);
}
export function GetBoardCards(boardID, then) {
    var url = "https://api.trello.com/1/boards/"
        + boardID
        + "/cards?"
        + keyTokenString;
    Utils.simpleAjaxCall(url, then);
}
export function GetBoardLists(boardID, then) {
    var url = "https://api.trello.com/1/boards/"
        + boardID
        + "/lists?"
        + keyTokenString;
    Utils.simpleAjaxCall(url, then);
}
export function GetListCards(listID, then) {
    var url = "https://api.trello.com/1/lists/"
        + listID
        + "/cards?"
        + keyTokenString;
    Utils.simpleAjaxCall(url, then);
}
