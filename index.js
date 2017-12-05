var express = require('express')
    , bodyParser = require('body-parser');
var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules/jquery/dist'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/knockout/build/output'));
app.use(express.static('node_modules/knockstrap/build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var JsonDB = require('node-json-db');

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/recipes.htm");
})

app.get('/process_get', function (req, res) {
    // Prepare output in JSON format
    response = {
        first_name: req.query.first_name,
        last_name: req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

var port = process.env.PORT || 1337;
var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})


app.get('/recipes', function (req, res) {
    //The second argument is used to tell the DB to save after each push 
    //If you put false, you'll have to call the save() method. 
    //The third argument is to ask JsonDB to save the database in an human readable format. (default false) 
    var db = new JsonDB("VandewberryDB", true, false);
    var id = req.query.id; // $_GET["id"]
    var data = {};
    if (id) data = db.getData("/" + id);
    else data = db.getData("/recipes");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));


});

app.post('/recipes', function (req, res) {
    var db = new JsonDB("VandewberryDB", true, false);
    var allRecipes = db.getData("/recipes");
    var lastIndex = allRecipes[allRecipes.length - 1].id;
    req.body.id = lastIndex + 1;
    allRecipes.push(req.body);
    db.push('/recipes', allRecipes);

    res.setHeader('Content-Type', 'application/json');
    res.send({ id: req.body.id });
});

app.get('/recipes/delete', function (req, res) {
    var db = new JsonDB("VandewberryDB", true, false);
    var id = req.query.id; // $_GET["id"]
    var allRecipes = db.getData("/recipes");
    var toDelete = allRecipes.findIndex(function (recipe) {
        return recipe.id == id;
    });
    var data = { requestedID: id};
    if (toDelete) {
        data.recipe = db.getData("/recipes[" + toDelete + "]");
        db.delete("/recipes[" + toDelete + "]");
        data.status = "success";
    }
    else {
        data.status = "failed - no such recipe exists";
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
});