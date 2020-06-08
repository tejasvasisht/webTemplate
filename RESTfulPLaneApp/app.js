const express = require("express"),
      methodOverride = require("method-override"),
      app = express(),
      port = 3000,
      bodyParser = require("body-parser"),
      mongoose = require("mongoose");
  //APP CONFIG 
mongoose.set('useUnifiedTopology', true);   
mongoose.connect("mongodb://localhost:27017/plane_app", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));

    //MODEL CONFIG        
var planeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    created: {type: Date, default: Date.now}
});

var Plane = mongoose.model("Plane", planeSchema);

//RESTful routes
    //index
    app.get("/", function(req, res){
        res.render("landing");
    });
    app.get("/planes", function(req, res){
        Plane.find({}, function(err, planes){
            if(err){
                console.log(err);
            }else{
                res.render("index", {planes: planes});
                // console.log(req.body.Plane);
            }
        });
        
    });

    //NEW ROUTE
    app.get("/planes/new", function(req, res){
        res.render("new");
    })

    //CREATE ROUTE
    app.post("/planes", function(req, res){
        Plane.create(req.body.plane, function(err, newPlane){
            if(err){
                res.redirect("new");
            }else{
                res.redirect("/planes");
            }
        });
    });
    //SHOW ROUTE
    app.get("/planes/:id", function(req, res){
        Plane.findById(req.params.id, function(err, foundPlane){
            if(err){
                console.log(err);
            }else{
                res.render("show", {plane: foundPlane});
            }
        });
    }); 

    //EDIT ROUTE
    app.get("/planes/:id/edit", function(req, res){
        Plane.findById(req.params.id, function(err, editPlane){
            if(err){
                res.redirect("/planes");
                console.error(err);
            }else{
                res.render("edit", {plane: editPlane} );
            }
        });
    });

    //UPDATE ROUTE
    app.put("/planes/:id", function(req,res){
        Plane.findByIdAndUpdate(req.params.id, req.body.plane, function(err, updateBlog){
            if(err){
                res.redirect("/planes");
            }else{
                res.redirect("/planes/" + req.params.id);
            }
        });
    });

    //DELETE ROUTE
    app.delete("/planes/:id", function(req, res){
        Plane.findByIdAndRemove(req.params.id, function(err){
            if(err){
                res.redirect("/planes");
            }else{
                res.redirect("/planes");
            }
        });
    });

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
