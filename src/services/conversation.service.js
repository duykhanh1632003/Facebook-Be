"use strict"

const {conversation} = require('../models/conversation.model');


class ConversationService{
    static createConversation = async({
        senderId, receiverId
    })=>{
        try{
            console.log(senderId,receiverId);
            const newConversation = await conversation.create({
                members: [senderId, receiverId],
            });
            if(newConversation){
                return newConversation ;
            }
            else{
                return {
                    code:"xxx",
                    message:"conversation not create!",
                }
            }
        }catch(err){
            return err ;
        }
    }

    static getListConversations = async ({userId})=>{
        try{
            const listConversation = await conversation.find({
                members: {$in : [userId]},
            });
            if(!listConversation){
                return {
                    code:"xxx",
                    message:"Not get listConversations",
                }
            }
            return {
                code:"xxx",
                metadata:listConversation,
            }
        }catch(err){
            return {
                code:"xxx",
                error:err,
            } ;
        }
    }
    
};

module.exports = ConversationService ;