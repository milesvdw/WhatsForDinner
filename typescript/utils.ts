import * as Models from "./models.js"

export function fuzzyCompare(str1, str2, fuzz) {
    return str1 == str2 || str1 == str2 + fuzz || str1 + fuzz == str2;
}

export function compareIngredients(a: Models.Ingredient, b: Models.Ingredient) {
    var str1 = a.name.replace(' ', '').toLowerCase();
    var str2 = b.name.replace(' ', '').toLowerCase();
    return fuzzyCompare(str1, str2, 's') || fuzzyCompare(str1, str2, 'es') || fuzzyCompare(str1, str2, 'cooked');
}


export function remove_row(row) {
    $(row).closest('.row').remove();
}

export function simpleAjaxCall(url, then) {
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