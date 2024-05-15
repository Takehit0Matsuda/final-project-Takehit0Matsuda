const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");
const passport = require("passport");

require("./config/passport")(passport)

mongoose.connect("mongodb://mongo:27017/acemdb", {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("database connected")
            const app = express()
            app.use(bodyParser.urlencoded({extended: true}))
            app.use(bodyParser.json())
            app.use(express.urlencoded({extended: false}))

            app.use("/api/auth", routes.auth)
            app.use("/api", passport.authenticate("jwt", {session: false}), routes.posts)

            app.listen(3000, () =>{
                console.log("running port 3000")  
                console.log("access to http://localhost:3000")
            })
        })
        .catch(err => {
            console.error("Mongo Connection Error", err);
            process.exit();
        });




//connect to database
//pass:63mnAGe8Lnm5MCpE
// mongoose.connect(
//     "mongodb+srv://mattsutaking:63mnAGe8Lnm5MCpE@cluster0.f45vcvw.mongodb.net/Posts?retryWrites=true&w=majority"
//     )
//     .then(() => console.log("database connected"))
//     .catch((err) => console.log(err));

// app.listen(3000, () =>{
//     console.log("running port 3000")  
//     console.log("access to http://localhost:3000");
// })

