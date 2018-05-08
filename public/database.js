import * as Utils from "./utils.js";
export function DeleteRecipe(id, then) {
    var url = "/recipes/delete/"
        + "?id="
        + id;
    Utils.simpleAjaxCall(url, then);
}
export function GetRecipes(then) {
    var url = "/recipes/get";
    Utils.simpleAjaxCall(url, then);
}
export function GetInventory(then) {
    var url = "/inventory/get";
    Utils.simpleAjaxCall(url, then);
}
