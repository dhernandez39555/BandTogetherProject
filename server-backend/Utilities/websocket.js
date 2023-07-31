const WebSocket = require('ws');
require('dotenv').config();
const http = require('http');
const express = require('express')

const wss = new WebSocket.Server({ port: process.env.WSS_PORT || 8000 })

const clients = new Map();

// for sending messages to everyone not ideal will probably slow the app alot if used
function broadcastMessage(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message))
        }
    })
}

wss.on('connection', (ws,req) => {
    const userId = req.url.split('=')[1]

    if (userId) {
        clients.set(userId,ws)
    }

    ws.on('message',(message) => {
        try {
            const parsedMessage = JSON.parse(message);
            handleMessage(parsedMessage, userId)
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

function handleMessage(message, senderUserId) {
    if(message) {
        handleChatMessage(message, senderUserId, message.receiver)
        console.log('message:',message)
        return;
    } else {
        console.log('UH OH')
    }
}

function handleChatMessage(message, senderUserId, receiverUserId) {
    const recipientWs = clients.get(message.receiver)
    
console.log('message priming')
    if(recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        recipientWs.send(JSON.stringify(message))
        console.log('message primed')
    } else {
        console.log('no recipient found' , receiverUserId)
    }
}


wss.on('listening',() => {
    console.log('WebSocket server started: on ', process.env.WSS_PORT)
})

module.exports = wss;