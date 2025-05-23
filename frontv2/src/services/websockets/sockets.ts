// src/plugins/socket.js
import { io } from 'socket.io-client';
import config from '@/types/config';
import Cookies from 'js-cookie';

const socket = io(config.socketUrl, {
  transports: ['websocket'], // Usa WebSocket como transporte principal
  reconnection: true,        // Intenta reconectar automáticamente
  reconnectionAttempts: 5    // Número máximo de intentos
});

socket.on('connect', () => {
    console.log('Connected to server');
    if(Cookies.get('userData')){
        socket.emit('login', {userData: JSON.parse(Cookies.get('userData') || '')});
    }
});

export default socket;