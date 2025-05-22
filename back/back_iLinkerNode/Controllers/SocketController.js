// Controllers/SocketController.js
const AuthenticatorController = require('./AuthenticatorController');
const ChatController = require('./ChatController');

class SocketController {
    static initialize(io) {
        let userNumber = 0;
        // Array para almacenar todos los usuarios (online y offline)
        let users = [];

        io.on('connection', (socket) => {
            
            // Eventos de autenticación
            socket.on('login', AuthenticatorController.login(socket, io, users));
            socket.on('logout', AuthenticatorController.logout(socket, io, users));
            socket.on('get_users_list', AuthenticatorController.getUsersList(socket, users));
            
            // Eventos de mensajería directa
            socket.on('send_direct_message', ChatController.sendDirectMessage(socket, io, users));
            socket.on('check_user_status', ChatController.checkUserStatus(socket, users));
            socket.on('get_message_history', ChatController.getMessageHistory(socket, users));
            
            // Manejo de desconexión
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                
                // Buscar el usuario por su ID de socket
                const userIndex = users.findIndex(user => user.idUser === socket.idUser);
                
                if (userIndex !== -1) {
                    const username = users[userIndex].username;
                    console.log(`User ${username} disconnected`);
                    
                    // Marcamos al usuario como offline
                    users[userIndex].status = 'offline';
                    users[userIndex].lastSeen = new Date();
                    
                    // Notificamos a todos los usuarios la lista actualizada
                    io.emit('users_list_updated', {
                        users: users.map(u => ({
                            username: u.username,
                            status: u.status,
                            idUser: u.idUser
                        }))
                    });
                }
            });
        });
    }
}

module.exports = SocketController;