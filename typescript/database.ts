import * as Models from "./models.js"
import * as Utils from "./utils.js"

export function DeleteRecipe(id, then) {
    var url: string = "/recipes/delete/"
        + "?id="
        + id;
    Utils.simpleAjaxCall(url, then);
}

export function GetRecipes(then: Function) {
    var url: string = "/recipes/get";
    Utils.simpleAjaxCall(url, then);
}

export function GetInventory(then: Function) {
    var url: string = "/inventory/get";
    Utils.simpleAjaxCall(url, then);
}