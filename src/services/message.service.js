"use strict"

const {message}  = require('../models/message.model');
const mongoose = require("mongoose");

class MessageService{
    static sendMessage = async({
        conversationId,
        sender,
        contentMessage,
        img,
        file,
    })=>{
        try{
            console.log(conversationId);
            const newMessage = await message.create({
                conversationId,
                sender,
                contentMessage,
                img,
                file,
            });
            if(!newMessage){
                return {
                    code:'xxx',
                    message:'Not create message',
                }
            }
            console.log(newMessage)
            return {
                code:'xxx',
                metadata:newMessage,
            }
        }catch(err){
            return {
                code:'xxx',
                err:err,
            }
        }

    }
    
    static getMessages = async({
        conversationId,
    })=>{
        try{
            console.log(conversationId);
            
            
            console.log(typeof conversationId);
                
                
            const ConversationObjectId = new mongoose.Types.ObjectId(conversationId);
            console.log(ConversationObjectId);
            const listMessage = await message.find({ conversationId:ConversationObjectId}).populate({path:'sender', select:['firstName',"lastName","avatar"]});
            console.log(listMessage);
            if(!listMessage){
                return{
                    code:"xxx",
                    message:"Not get listMessage",
                };
            }
            console.log(listMessage);
            return {
                status:"200",
                message:"Get list successfully!",
                metadata: {listMessage},
            }
        }catch(err){
            return{
                code:"xxx",
                message:err,
            };
        };
    }

    static deleteMessage = async ({id})=>{
        try{
            console.log(id);
            try{
                await message.deleteOne({_id:new mongoose.Types.ObjectId(id)});
            }catch(err){
                console.log(err);
            }
            console.log("hhh");
            const deletedMessage = await message.find({_id: new mongoose.Types.ObjectId(id)});
            console.log(deletedMessage);
            if(deletedMessage){
                return{
                    code:'200',
                    message:"Message don't delete!",
                }
            }
            return {
                code:'200',
                message:"Delete message successfully!",
            }
        }catch(error){
            return {
                code:'500',
                err:error,
            }
        }
    }

}

module.exports = MessageService ;