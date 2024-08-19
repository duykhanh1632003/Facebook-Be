"use strict"

const MessageService = require('../services/message.service');
const {SuccessResponse} = require('../core/success.response');

class MessageController{
    handleSendMessage = async (req,res,next)=>{
        const data = await MessageService.sendMessage(req.body);
        new SuccessResponse(data).send(res);
    };
    handleGetListMessage = async (req,res,next)=>{
        const conversationId = req.params.conversationId;
        const data = await MessageService.getMessages({conversationId});
        new SuccessResponse(data).send(res);
    }
    handleDeleteMessage = async (req,res,next)=>{
        const id = req.params.id;
        const data = await MessageService.deleteMessage({id});
        new SuccessResponse(data).send(res);
    }
}

module.exports = new MessageController();