var express = require('express')
    , bodyParser = require('body-parser');
var app = express();
const mongodb = require('mongodb');
const db_name = 'heroku_6ftkk7t9';

app.use(express.static('public'));
app.use(express.static('node_modules/jquery/dist'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/knockout/build/output'));
app.use(express.static('node_modules/knockstrap/build'));
app.use(express.static('node_modules/requirejs'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/recipes.htm");
})

app.get('/recipes', function (req, res) {
    res.sendFile(__dirname + "/recipes.htm");
});

var port = process.env.PORT || 1337;
var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})

app.get('/recipes/get', function (req, res) {

    mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
        if (err) throw err;

        var db = client.db(db_name);

        var id = parseInt(req.query.id);

        var respond = function (err, result) {
            if (err) throw err;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        }
        if (id) {
            var query = { id: id };
            data = db.collection("recipes").find(query).toArray(respond);
        }
        else data = db.collection("recipes").find().toArray(respond);
    });
});

app.get('/inventory/get', function (req, res) {

    mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
        if (err) throw err;

        var db = client.db(db_name);

        var name = parseInt(req.query.name);

        var respond = function (err, result) {
            console.log(err);
            if (err) throw err;
            console.log(result);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        }
        if (name) {
            var query = { name: name };
            data = db.collection("inventory").find(query).toArray(respond);
        }
        else data = db.collection("inventory").find().toArray(respond);
    });
});

app.post('/inventory', function (req, res) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
        if (err) throw err;

        var db = client.db(db_name);

        var name = parseInt(req.query.name);

        var respond = function (err, result) {
            if (err != null) throw err;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        }

        if (name == null) throw err;
        var query = { name: name };
        data = db.collection("inventory").insert(req.body, { w: 1 }, respond);

    });
});

app.post('/recipes', function (req, res) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
        if (err) throw err;

        var db = client.db(db_name);

        var name = parseInt(req.query.name);

        var respond = function (err, result) {
            if (err != null) throw err;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        }

        if (name == null) throw err;
        var query = { name: name };
        data = db.collection("recipe").insert(req.body, { w: 1 }, respond);

    });
});

app.get('/recipes/delete', function (req, res) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
        if (err) throw err;

        var db = client.db(db_name);

        var name = parseInt(req.query.name);

        var respond = function (err, n_removed) {
            if (err != null) throw err;

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(n_removed ? 'success' : 'failed - no such recipe'));
        }

        if (name == null) throw err;
        var query = { name: name };
        data = db.collection("inventory").remove({id: req.query.id}, { w: 1 }, respond);

    });
});

app.get('/inventory', function (req, res) {
    res.sendFile(__dirname + "/inventory.htm");
});