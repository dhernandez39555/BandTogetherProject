const WebSocket = require('ws');

require('dotenv').config();

const runWebSocket = () => {
    const wss = new WebSocket.Server({ port: process.env.WSSPORT })


    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            wss.clients.forEach((client) => {
                if(client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message)
                }
            })
        })
    })
}

module.exports = runWebSocket;