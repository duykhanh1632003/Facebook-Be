"use strict"

const mongoose = require('mongoose');

const DOCUMENT_NAME  = "conversation" ;
const COLLECTION_NAME = "conversations" ;

const conversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
        },
    },
    {
        timestamps:true,
        collection:COLLECTION_NAME,
    }
);

module.exports = {conversation: mongoose.model(DOCUMENT_NAME,conversationSchema)};