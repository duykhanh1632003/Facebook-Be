"use strict"

const ConversationService = require('../services/conversation.service.js');
const {SuccessResponse} = require('../core/success.response.js');

class ConversationController{
    handleCreateConversation = async (req,res,next)=>{
        const data = await ConversationService.createConversation(req.body);
        new SuccessResponse(data).send(res);
    };
    handleGetListConversations = async(req,res,next)=>{
        const data = await ConversationService.getListConversations({userId:req.params.userId});
        console.log(data);
        new SuccessResponse(data).send(res);
    }
}

module.exports = new ConversationController();