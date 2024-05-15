const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        post_id : {
            type : Number,
            required : true,
            trim : true, //delete blank
        },
        date : {
            type : String,
            required : true,
        },
        user_id : {
            type : Number,
            required : true,
            trim : true, //delete blank
        },
        book_id : {
            type : Number,
            required : true,
            trim : true, //delete blank
        },
        comment : {
            type : String,

        },
        status : {
            type : Number,

        }

    }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post; 