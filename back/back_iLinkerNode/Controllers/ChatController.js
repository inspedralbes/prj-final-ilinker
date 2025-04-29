// Controllers/ChatController.js

class ChatController {
    // Enviar mensaje directo de usuario a usuario
    static sendDirectMessage(socket, io, users) {
        return (messageData) => {
            try {
                // Obtenemos el usuario que envía el mensaje
                const sender = users.find(u => u.idUser === socket.idUser);
                if (!sender) {
                    socket.emit('error', { message: 'You must be logged in to send messages' });
                    return;
                }
                
                // Validamos que se proporcione un destinatario
                if (!messageData.to) {
                    socket.emit('error', { message: 'Recipient is required' });
                    return;
                }
                
                // Buscamos al usuario destinatario
                const recipient = users.find(u => u.username === messageData.to || u.idUser === messageData.to);
                if (!recipient) {
                    socket.emit('error', { message: 'Recipient not found' });
                    return;
                }
                
                console.log(`Direct message from ${sender.username} to ${recipient.username}: ${messageData.text}`);
                
                // Preparar el mensaje con la información
                const message = {
                    id: Date.now(),
                    text: messageData.text,
                    from: {
                        idUser: sender.idUser,
                        username: sender.username
                    },
                    to: {
                        idUser: recipient.idUser,
                        username: recipient.username
                    },
                    timestamp: new Date()
                };
                
                // Enviamos el mensaje al destinatario si está online
                if (recipient.status === 'online' && recipient.socketId) {
                    io.to(recipient.socketId).emit('direct_message', message);
                }
                
                // También enviamos confirmación al remitente
                socket.emit('direct_message', message);
                
            } catch (error) {
                console.error('Error sending direct message:', error);
                socket.emit('error', { message: 'Error sending message' });
            }
        };
    }
    
    // Verificar si un usuario está online
    static checkUserStatus(socket, users) {
        return (userData) => {
            try {
                if (!userData.username) {
                    socket.emit('error', { message: 'Username is required' });
                    return;
                }
                
                const user = users.find(u => u.username === userData.username);
                
                if (!user) {
                    socket.emit('user_status', { 
                        username: userData.username,
                        status: 'not_found'
                    });
                    return;
                }
                
                socket.emit('user_status', {
                    username: user.username,
                    status: user.status,
                    idUser: user.idUser
                });
                
            } catch (error) {
                console.error('Error checking user status:', error);
                socket.emit('error', { message: 'Error checking user status' });
            }
        };
    }
    
    // Obtener historial de mensajes (en una implementación real, esto podría obtener mensajes de una base de datos)
    static getMessageHistory(socket, users) {
        return (userData) => {
            try {
                const user = users.find(u => u.idUser === socket.idUser);
                if (!user) {
                    socket.emit('error', { message: 'You must be logged in to access message history' });
                    return;
                }
                
                // En una implementación real, aquí obtendrías mensajes de una base de datos
                // Por ahora, solo enviamos un mensaje de ejemplo
                socket.emit('message_history', {
                    with: userData.username,
                    messages: [
                        // En una implementación real, estos mensajes vendrían de tu base de datos
                        {
                            id: 1,
                            text: "Este es un mensaje de ejemplo. En una implementación real, cargarías los mensajes desde una base de datos.",
                            from: {
                                idUser: 0,
                                username: "sistema"
                            },
                            to: {
                                idUser: user.idUser,
                                username: user.username
                            },
                            timestamp: new Date()
                        }
                    ]
                });
                
            } catch (error) {
                console.error('Error getting message history:', error);
                socket.emit('error', { message: 'Error retrieving message history' });
            }
        };
    }
}

module.exports = ChatController;