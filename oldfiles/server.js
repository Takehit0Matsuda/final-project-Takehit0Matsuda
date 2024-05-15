const express = require("express");
const app = express();
const mongoose = require("mongoose");

const postRouter = require("./routes/PostRoutes");

app.use(postRouter);

//connect to database
//pass:63mnAGe8Lnm5MCpE
mongoose.connect(
    "mongodb+srv://mattsutaking:63mnAGe8Lnm5MCpE@cluster0.f45vcvw.mongodb.net/Posts?retryWrites=true&w=majority"
    )
    .then(() => console.log("database connected"))
    .catch((err) => console.log(err));

app.listen(8080, () =>{
    console.log("running port 8080")  
    console.log("access to http://localhost:8080");
})

