// src/plugins/socket.js
import { io } from 'socket.io-client';
import config from '@/types/config';

const socket = io(config.socketUrl, {
  transports: ['websocket'], // Usa WebSocket como transporte principal
  reconnection: true,        // Intenta reconectar automáticamente
  reconnectionAttempts: 5    // Número máximo de intentos
});

export default socket;