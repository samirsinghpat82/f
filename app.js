const express= require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
const { ReplSet, Int32 } = require("mongodb");

const app= express();
app.set ('view engine', 'ejs');

app.use (bodyParser.urlencoded({
    extended:true
}));

app.use(express.static ("public"));


mongoose.connect ("mongodb://localhost:27017/students",{useNewUrlParser:true});

const candidateSchema ={
    name:String,
    email:String,
    test_scores:[]
};




const Candidate =mongoose.model("Candidate",candidateSchema);



// To get all data
app.get("/candidates", function (req, res){
    Candidate.find( function(err, foundCandidates){
        console.log(foundCandidates)
    });
});



// to get max
Candidate.aggregate({test_scores : {$gte:1}}, function(err,docs){
    if(err){
        console.log(err)
    }
    else {
        console.log("Result: ", docs)
    }
});


// To get high score
Candidate.statics.findMax=function(callback) {
    this.findOne({ name: "samir" }).sort('test_scores').exec()
}

Candidate.findMax();



// To post to the database

app.post ("/candidates", function(req,res){
    req.body.name,
    req.body.email,
    req.body.test_scores
    

    const newCandidate = new Candidate({
        name: req.body.name,
        email: req.body.email,
        testScores:req.body.test_scores
       

    });
    newCandidate.save();
});



app.listen (3000,function(){
    console.log ("server started on port 3000");
});