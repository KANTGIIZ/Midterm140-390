
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

app.get('/addmusic', function (req, res) {
  res.render('pages/addmusic');
});

app.get('/music', function (req, res) {
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Musics");
    var query = {};
    dbo.collection("Musicsdb")
      .find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('pages/music', { music: result });
        db.close();
      });
  });

});

app.post('/addmusicadd', function (req, res) {
  var names = req.body.name;
  var albums= req.body.album;
  var prices = req.body.price;
  var dates = req.body.date;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Musics");
    var myobj = {  music_name: names,
      album: albums,
      price: prices,
      date:dates
     };
    dbo.collection("Musicsdb").insertOne(myobj, function(err, result) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
      res.redirect("/music");
    });
  });

});

app.get('/musicdetails/:name', function (req, res) {
  var namemus = req.params.name;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Musics");
    var query = { music_name: namemus };
    dbo.collection("Musicsdb").findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('pages/musicdetails', { detail: result });
      db.close();
    });
  });
});

app.get('/edit/:name', function (req, res) {
  var namemusedit = req.params.name;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Musics");
    var query = { music_name: namemusedit };
    dbo.collection("Musicsdb").findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('pages/edit', { detail: result });
      db.close();
    });
  });
});

app.post('/musicsave', function (req, res) {
  var names = req.body.name;
  var albums= req.body.album;
  var prices = req.body.price;
  var dates = req.body.date;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Musics");
    var myquery = { music_name: names };
    var newvalues = {
      $set: {
        music_name: names,
        album: albums,
        price: prices,
        date:dates
      }
    };
    dbo.collection("Musicsdb").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      res.redirect("/music");
    });
  });
});

app.get('/delete/:name', function (req, res) {
  var named = req.params.name;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Musics");
    var myquery = {music_name:
      named};
    dbo.collection("Musicsdb").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
      res.redirect("/music");
    });
  });
});

app.listen(8080);
console.log('8080 is the magic port http://localhost:8080/');