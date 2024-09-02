const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const flash = require("connect-flash");

app.engine('ejs', engine);
app.set("views",path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.get("/", (req,res)=>{
    res.send("New Project root is Working!");
});

app.get("/Home", (req,res)=>{
    res.render("home.ejs");
});


app.listen(8080, ()=>{
    console.log("Listening on port 8080 ChaturGanit stats");
});