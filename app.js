var express = require("express"), bodyParser = require("body-parser"), mongoose = require("mongoose"), app=express(), methodOverRide = require("method-override"), sanitizer = require("express-sanitizer");


/*Setting up method override for other request like put and destroy*/
app.use(methodOverRide("_method"));

/*Setting up mongoose*/
//mongoose.connect("mongodb://localhost:27017/blogApp", {useNewUrlParser : true});
mongoose.connect("mongodb+srv://fqayyum786:Fahad@786@yelpcamp-esxrl.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser : true});
var blogSchema = new mongoose.Schema({
    name: String,
    img : String,
    desc : String,
    date : {type: Date, default : Date.now}
});
var blog = mongoose.model("blog", blogSchema);

/*Setting up express*/
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(sanitizer());

/*RESTful routes*/
app.get("/",function(req, res) {
    res.redirect("/blogs");
})

app.get("/blogs", function(req,res){
    blog.find({},function(err, blog){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blog : blog});
        }
    });
});

app.get("/blogs/new", function(req,res){
    res.render("new");
});

app.post("/blogs", function(req,res){
    var name = req.sanitize(req.body.name), img = req.sanitize(req.body.img), desc = req.sanitize(req.body.desc);
    blog.create({name : name, img : img ,desc : desc}, function(err,blog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});
app.get("/blogs/:id", function(req, res) {
    blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        }else{
            res.render("show",{blog:blog});
        }
    })
})
app.get("/blogs/:id/edit", function(req, res) {
    blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        }else{
            res.render("edit", {blog : blog});
        }
    });
});

app.put("/blogs/:id", function(req,res){
    
  blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
      if(err){
          console.log(err);
      }else{
          res.redirect("/blogs/"+ blog._id);
      }
  })
});
app.delete("/blogs/:id", function(req,res){
   blog.findByIdAndDelete(req.params.id,function(err, blog){
      if(err){
          console.log(err);
      }else{
          res.redirect("/blogs");
      }
  }) 
});
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Blog App server started!");
})