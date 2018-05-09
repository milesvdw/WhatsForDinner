import * as Models from "./models.js"
import * as Database from "./database.js"

class InventoryViewModel {


    public add_edit_ingredient = ko.observable(new Models.Ingredient());

    public inventory = ko.observableArray([] as Models.Ingredient[]);

    public in_house = ko.pureComputed(() => {
        return this.inventory().filter((ingredient) => {
            return ingredient.status == "have";
        })
    })
    public shopping_list = ko.pureComputed(() => {
        return this.inventory().filter((ingredient) => {
            return ingredient.status == "need";
        })
    })
    public archived_ingredients = ko.pureComputed(() => {
        return this.inventory().filter((ingredient) => {
            return ingredient.status == "archived";
        })
    })

    public delete_ingredient(id) {
        alert("not implemented");
    }
     
    public edit_ingredient(id) {
    }

    public save_inventory_item() {
        if(this.inventory().some((ingredient) => { return ingredient.name == vm.add_edit_ingredient().name })) {
            alert("don't create duplicate ingredients");
            return;
        };
        vm.add_edit_ingredient().Save((data) => {
            vm.inventory.push(new Models.Ingredient(vm.add_edit_ingredient()));
            vm.inventory.sort(function (r1, r2) { return r1.name.localeCompare(r2.name) });
        });
    
        return false;
    }

    public stock_ingredient(ingredient) {
        ingredient.status = "have";
        this.inventory.notifySubscribers();
    }

    public unstock_ingredient(ingredient) {
        ingredient.status = "need";
        this.inventory.notifySubscribers();
    }

    public archive_ingredient(ingredient) {
        ingredient.status = "archived";
        this.inventory.notifySubscribers();
    }
}

let vm = new InventoryViewModel();

ko.applyBindings(vm);


Database.GetInventory(function (inventory) {
    vm.inventory(inventory.map(function (ingredient) { return new Models.Ingredient(ingredient) }));
    vm.inventory.sort(function (r1, r2) { return r1.name.localeCompare(r2.name) })
});

$("body").on("mouseover mouseout", '.recipe-row .btn', function () {
    $(this).toggleClass('active');
});

