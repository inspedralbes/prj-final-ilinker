class SocketController {
    static initialize(io) {
        var userNumber = 0;

        io.on('connection', (socket) => {
            console.log('A user connected');
            socket.idUser = userNumber++;
            
        });
    }
}

module.exports = SocketController;