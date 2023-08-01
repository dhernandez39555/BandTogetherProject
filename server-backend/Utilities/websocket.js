const WebSocket = require('ws');
require('dotenv').config();
const http = require('http');
const express = require('express')

const wss = new WebSocket.Server({ port: process.env.WSS_PORT || 8000 })

const clients = new Map();



wss.on('connection', (ws,req) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('user-id');
    const receiverId = urlParams.get('receiver-id');

    console.log('22222 User logged in :', userId)
    console.log('22222 receiver ID:' , receiverId)

    if (userId) {
        clients.set(userId,ws)
    }

    ws.on('message',(message) => {
        console.log('message incoming to:', userId)
        try {
            const parsedMessage = JSON.parse(message);
            handleMessage(parsedMessage, userId, receiverId)
            
        } catch (err) {
            console.log('error parsing websocket message', err)
        }
    })
    ws.on('close', () => {
        if(userId) {
            clients.delete(userId)
        }
    })
})


//! 64b is id for grimey 

function handleMessage(message, senderId, receiverId) {
    if(message) {
    
        handleChatMessage(message, senderId, receiverId)

        return;
    } else {
        console.log('UH OH')
    }
}
function handleChatMessage(message, senderId, receiverId) {

    const recipientWs = clients.get(receiverId)

    console.log('===Message received:', message);
    console.log('===Sender ID:', senderId);
    console.log('===Receiver ID:', receiverId);
    console.log('===Recipient WebSocket:', recipientWs);
    
console.log('message priming')
    if(recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        recipientWs.send(JSON.stringify(message))
        console.log('message primed')
    } else {
        console.log('no recipient found' , receiverId)
    }
}


wss.on('listening',() => {
    console.log('WebSocket server started: on ', process.env.WSS_PORT)
})

module.exports = wss;