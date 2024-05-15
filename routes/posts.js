const express = require("express");
const router = express.Router();
const models = require("../models");
const Post = models.Post_model


router.use( (req, res, next) => {
    console.log("A request came in...")
    next();
});

router.get("/testAPI", (req, res) => {
    const resObject = {
        message: "Test API is working",
        user: req.user
    }
    return res.send(resObject)
});

//router.use( (req, res, next)
//router.use(express.json());

//get all data
router.get("/posts", function(req,res) {
    //return all information in post's database
    Post.find({})
    .then(function(products) {
        res.json(products)
    })
    .catch(function(err) {
        res.status(500)
        res.json({success: false, error: err})
    })
});

//create data
router.post("/posts", function(req,res) {
    if (!req.body.title || !req.body.content){
        res.status(400)
        res.json({success: false, error: "Missing title or content"})
    }
    //create information in post's database
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.user._id
    })
    post.save()
    .then(
        res.json(post)
    )
    .catch(function(err) {
        res.status(500)
        res.json({success: false, error: err})
    })
});

//get one data
router.get("/post/:id", function(req,res) {
    Post.findOne({_id: req.params.id})
    .populate("author", "email")
    .then(function(post) {
        if(post){
            console.log(req.user)
            res.json(post)
        }
        else{
            res.status(404)
            res.json({error: "Post Doesn't exist!"})
        }
    })
    .catch(function(err) {
        console.log(err)
        res.status(500)
        res.json({message: "Error", error: err})
    })
});

//edit data
router.patch("/post/:id", async (req,res) => {
    Post.findOne({_id: req.params.id})
    .then(function(post){
        if (post.author._id.toString() === req.user._id.toString() || req.user.isAdmin()){
            //edit specific information in post's database
            try {
                post.set(req.body);
                post.save();
            } catch (err) {
                res.status(500).send(err);
            }
        }else{
            res.status(403)
            res.json({success: false, error: "Only the user who posted this submission and the administrator are allowed edit operation"})
        }
    })
    .catch(function(err) {
        console.log(err)
        res.status(500)
        res.json({message: "Error", error: err})
    })
});

//delete data
router.delete("/post/:id", async (req,res) => {
    Post.findOne({_id: req.params.id})
    .then(function(post){
        if (post.author._id.toString() === req.user._id.toString() || req.user.isAdmin()){
            //edit specific information in post's database
            try {
                post.delete();
                Post.save();
            } catch (err) {
                res.status(500).send(err);
            }
        }else{
            res.status(403)
            res.json({success: false, error: "Only the user who posted this submission and the administrator are allowed delete operation"})
        }
    })
    .catch(function(err) {
        console.log(err)
        res.status(500)
        res.json({message: "Error", error: err})
    })
});


module.exports = router;