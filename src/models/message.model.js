"use strict"

const mongoose = require('mongoose');

const DOCUMENT_NAME = "message";
const COLLECTION_NAME = "messages";

const messageSchema = new mongoose.Schema(
    {
        conversationId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "conversation"
        },
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        contentMessage:{
            type:String,
        },
        img:{
            type:String,
        },
        file:{
            type:String,
        },
    },
    {
        timestamps:true,
        collection:COLLECTION_NAME,
    }
);

module.exports = {message: mongoose.model(DOCUMENT_NAME,messageSchema)};