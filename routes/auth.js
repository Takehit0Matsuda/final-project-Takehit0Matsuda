const express = require("express")
const router = express.Router();
const models = require("../models")
const User = models.User_model
const Post = models.Post_model
const passport = require("passport")
const jwt = require("jsonwebtoken")
const config = require("../config/config")

router.post("/signup", (req,res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400)
        res.json({success: false, message: "Email and Password Requied"})
    }
    else{
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        })
        user.save((err) => {
            if(err){
                console.log(err)
                res.status(400)
                return res.json({success: false, message: "Email already exists"})
            }
            res.json({
                success: true,
                message: "Created User",
                user: user
            })
        })
    }
})

router.post("/login", async (req,res) => {
    User.findOne({email: req.body.email}, function(err,user) {
        if (err) throw err;
        if (!user) {
            res.status(401).send({success: false, message: "User not found"})
        }
        else{
            user.comparePassword(req.body.password, function(err, isMatch) {
                if(isMatch) {
                    const tokenObj = {_id: user._id, email: user.email}
                    const token = jwt.sign(tokenObj, config.secret)
                    res.send({success: true, token: "JWT "+token})
                }
                else{
                    res.status(401).send({success: false, message: "Wrong Password"})
                }
            })
        }
    })
})

router.get("/users", function(req,res) {
    //return all information in post's database
    User.find({})
    .then(function(users) {
        res.json(users)
    })
    .catch(function(err) {
        res.status(500)
        res.json({success: false, error: err})
    })
});

router.get("/user/:id", function(req,res) {
    //return all information in post's database
    User.findOne({_id: req.params.id})
    .then(function(user) {
        console.log(user._id)
        console.log(req.params.id)
        console.log(req.query._id)
        res.json(user)
    })
    .catch(function(err) {
        res.status(500)
        res.json({success: false, error: err})
    })
});

router.patch("/user/:id", passport.authenticate("jwt", {session: false}), async(req,res) => {
    User.findOne({_id: req.params.id})
    .then(function(user){
        if (user._id.toString() === req.user._id.toString() || req.user.isAdmin()){
            user.comparePassword(req.body.password, function(err, isMatch) {
                if(isMatch) {
                    user.password = req.body.new_password
                    user.email = req.body.email
                    user.save()
                }
                else{
                    res.status(401).send({success: false, message: "Wrong Password"})
                }
            })
        }else{
            res.status(403)
            res.json({success: false, error: "Unauthorized request"})
        }
    })
    .catch(function(err) {
        console.log(err)
        res.status(500)
        res.json({message: "Error", error: err})
    })
});

router.delete("/user/:id", passport.authenticate("jwt", {session: false}), async (req,res) => {
    User.findOne({_id: req.params.id})
    .then(function(user){
        if (user._id.toString() === req.user._id.toString() || req.user.isAdmin()){
            //edit specific information in post's database
            try {
                user.delete();
                User.save();
            } catch (err) {
                res.status(500).send(err);
            }
        }else{
            res.status(403)
            res.json({success: false, error: "Unauthorized request"})
        }
    })
    .catch(function(err) {
        console.log(err)
        res.status(500)
        res.json({message: "Error", error: err})
    })
});


router.patch("/admin", passport.authenticate("jwt", {session: false}), (req,res) => {
    if(req.user.isAdmin()){
        User.findById(req.body._id)
        .then(function(be_admin){
            if(!be_admin){
                res.status(404)
                res.json({success: false, error: "User not found"})
            }
            else{
                be_admin.role = "admin"
                be_admin.save()
            }
        })
    }
    else{
        User.find({role : "admin"})
        .then(function(users) {
            if (users.length === 0) {
                req.user.role = "admin"
                req.user.save()
            } else {
                res.status(403)
                res.json({success: false, error: "Unauthorized request"})
            }
        })
        .catch(function(err) {
            res.status(500).json({ success: false, error: err })
        });
    }
})



module.exports = router;