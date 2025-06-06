// Controllers/AuthenticatorController.js

class AuthenticatorController {
    static login(socket, io, users) {
        // Retornamos una función que será el manejador del evento
        return ({userData, token}) => {
            console.log('User login:', userData);
            
            // No hacemos verificación aquí porque se hace en el frontend
            const user = {
                idUser: userData.id,
                socketId: socket.id,
                username: userData.name,
                token: token,
                // Otros datos que vengan del frontend
                ...userData
            };
            // Verificamos si ya existe este usuario
            const existingUserIndex = users.findIndex(u => u.idUser === userData.id);
            if (existingUserIndex !== -1) {
                // Si el usuario ya existe, actualizamos su socketId y status
                users[existingUserIndex].socketId = socket.id;
                console.log(`User ${userData.name} reconnected`);
            } else {
                // Si no existe, lo agregamos al array
                users.push(user);
                console.log(`User ${userData.name} added to users list`);
            }
            
            // Enviamos confirmación al usuario
            socket.emit('login_success', {
                user: user,
                token: token,
                message: 'Successfully logged in'
            });
            
            // Notificamos a todos los usuarios la lista actualizada
            io.emit('users_list_updated', {
                users: users.map(u => ({
                    username: u.name,
                    status: u.status,
                    idUser: u.idUser
                }))
            });
        };
    }
    
    static logout(socket, io, users) {
        return () => {
            const userIndex = users.findIndex(u => u.socketId === socket.id);
            if (userIndex !== -1) {
                const username = users[userIndex].username;
                console.log(`User ${username} logged out`);
                
                // Marcamos al usuario como offline en lugar de eliminarlo
                users[userIndex].status = 'offline';
                
                // Notificamos a todos los usuarios la lista actualizada
                io.emit('users_list_updated', {
                    users: users.map(u => ({
                        username: u.username,
                        status: u.status,
                        idUser: u.idUser
                    }))
                });
            }
        };
    }
    
    static getUsersList(socket, users) {
        return () => {
            socket.emit('users_list', {
                users: users.map(u => ({
                    username: u.username,
                    status: u.status,
                    idUser: u.idUser
                }))
            });
        };
    }
}

module.exports = AuthenticatorController;