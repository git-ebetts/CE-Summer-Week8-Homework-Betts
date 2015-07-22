var express = require("express");
var Tab = require("./app/tab");
var db = require("./app/config/db");
var Thing = require("./app/models/thing");
var bodyParser = require("body-parser");
var methodOverride = require('method-override');

db.connect()
    .then(function(){
        console.log("connected");
    })
    .catch(function(err){
        console.log(err);
    });


var app = express();
app.locals.pretty = true;
app.set("view engine", "jade");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride('_method'));



app.use(function(req, res, next){
    res.locals.tabs = [
            new Tab("Home", "/"),
            new Tab("People", "/people"),
            new Tab("Things", "/things")
    ];
    next(); 
});



app.get("/", function(req, res){
   res.render("index", {
       title: "Home",
       activePath: "/"
   });
});
app.get("/people", function(req, res){
   res.render("people", {
       title: "People",
       activePath: "/people"
   });
});
app.get("/things", function(req, res){
    Thing.find({}).then(function(things){
       res.render("things", {
           title: "Things",
           activePath: "/things",
           things: things
       });
    });
});

app.post("/things/new", function(req, res, next){
   var thing = new Thing(req.body);
   thing.save()
    .then(function(){
       res.redirect("/things")
       .catch(next);
    });
});

app.post("/things/:id", function(req, res, next){
    Thing.update(
        {_id: req.params.id},
        {$set:{ name: req.body.name}}
    ).then(function(){
        res.redirect("/things")
        .catch(next);
    });
});

app.get("/things/new", function(req, res){
    res.render("thing_new", {
        activePath: "/things",
        title: "Insert a New Thing"
    });
});
    

app.delete("/things/:id", function(req, res){
    Thing.findById(req.params.id).remove()
      .then(function(){
        res.redirect("/things");
        console.log('item removed!');
    });
});
    

app.get("/things/:id", function(req, res){
    Thing.findById(req.params.id)
        .then(function(thing){
            res.render("thing", {
               activePath: "/things",
               thing: thing,
               title: "Thing " + thing.name
            });
        });
});


app.use(function(req, res) {
      res.status(400);
      res.render('404.jade',
      {title: '404: File Not Found'});
  });

app.use(function(error, req, res, next) {
      res.status(500);
      res.render('500.jade', {title:'500: Internal Server Error', error: error});
  });


app.listen(3000);
console.log('Express started on port 3000');
// app.listen(process.env.PORT);