const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

let mensagens = []

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)

    // Para renderizar as mensagens anteriores quando um novo socket for conectado
    socket.emit('mensagensAnteriores', mensagens)
    console.log(mensagens)

    // Recebe a mensagem enviada pelo usuário
    socket.on('sendMessage',  data => {
        // Salva no array de mensagens
        mensagens.push(data)

        // Emite a mensagem para todos os outros usuários
        socket.broadcast.emit('receivedMessage', data)
    })
})

server.listen(3000, () => console.log('Servidor iniciado em: http://localhost:3000/'))