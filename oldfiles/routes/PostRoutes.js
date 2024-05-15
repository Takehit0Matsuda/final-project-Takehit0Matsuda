const express = require("express");
const app = express();
const postModel = require("../models/Posts");

app.use(express.json());

//get all data
app.get("/posts", async(req,res) => {
    //return all information in post's database
    const posts = await postModel.find({});

    try {
        res.send(posts);
    } catch (err) {
        res.status(500).send(err);
    }
});

//get one data
app.get("/post/:id", async(req,res) => {
    //return one information in post's database
    const post = await postModel.findById(req.params.id);

    try {
        res.send(post);
    } catch (err) {
        res.status(500).send(err);
    }
});


//create data
app.post("/post", async(req,res) => {
    //create information in post's database
    const post = new postModel(req.body);

    try {
        await post.save();
        res.send(post);
    } catch (err) {
        res.status(500).send(err);
    }
});

//edit data
app.patch("/post/:id", async(req,res) => {
    //edit specific information in post's database
    try {
        await postModel.findByIdAndUpdate(req.params.id, req.body);
        await postModel.save();
    } catch (err) {
        res.status(500).send(err);
    }
});

//delete data
app.delete("/post/:id", async(req,res) => {
    //delete information in post's database
    try {
        await postModel.findByIdAndDelete(req.params.id);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = app;