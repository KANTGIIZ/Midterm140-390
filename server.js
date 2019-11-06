
var express = require('express');
var bodyparser = require('body-parser');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/addgame', function (req, res) {
  res.render('pages/addgame');
});

app.get('/game', function (req, res) {
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("game");
    var query = {};
    dbo.collection("game")
      .find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('pages/game', { game: result });
        db.close();
      });
  });

});

app.post('/addgameadd', function (req, res) {
  var names = req.body.name;
  var types= req.body.type;
  var rates = req.body.rate;
  var prices = req.body.price;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("game");
    var myobj = {  
      Name: names,
      Type: types,
      Rate: rates,
      Price:prices
     };
    dbo.collection("game").insertOne(myobj, function(err, result) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
      res.redirect("/game");
    });
  });

});

app.get('/gamedetails/:name', function (req, res) {
  var namemus = req.params.name;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("game");
    var query = { Name: namemus };
    dbo.collection("game").findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('pages/gamedetails', { detail: result });
      db.close();
    });
  });
});

app.get('/edit/:name', function (req, res) {
  var namemusedit = req.params.name;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("game");
    var query = { Name: namemusedit };
    dbo.collection("game").findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('pages/edit', { detail: result });
      db.close();
    });
  });
});

app.post('/gamesave', function (req, res) {
  var names = req.body.name;
  var types= req.body.type;
  var rates = req.body.rate;
  var prices = req.body.price;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("game");
    var myquery = { Name: names };
    var newvalues = {
      $set: {
        Name: names,
        Type: types,
        Rate: rates,
        Price:prices
      }
    };
    dbo.collection("game").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      res.redirect("/game");
    });
  });
});

app.get('/delete/:name', function (req, res) {
  var named = req.params.name;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("game");
    var myquery = { Name:named};
    dbo.collection("game").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
      res.redirect("/game");
    });
  });
});

app.listen(8080);
console.log('8080 is the magic port http://localhost:8080/');