import SockJS from 'sockjs-client';
import * as StompClient from 'stompjs';

class WebSocketService {
    constructor() {
        this.socketClient = null;
        this.userId = null;
        this.keycloak = null;
        this.isConnected = false;
        this.retryAttempts = 0;
        this.maxRetries = 5;
    }

    connect(keycloak, notificationCallback) {
        this.keycloak = keycloak;
        this.userId = keycloak?.tokenParsed?.sub;

        if (!this.userId) {
            console.error('User ID not found. Cannot initialize WebSocket.');
            return;
        }

        // Close existing WebSocket connection if any
        if (this.ws) {
            console.log('Closing existing WebSocket connection.');
            this.ws.close();
        }

        this.ws = new SockJS('http://localhost:9192/ws');
        this.socketClient = StompClient.over(this.ws);

        this.socketClient.connect(
            { Authorization: 'Bearer ' + keycloak.token },
            () => {
                this.isConnected = true;
                console.log('WebSocket connected for user:', this.userId);

                this.subscribeToNotifications(this.userId, notificationCallback);
                this.retryAttempts = 0;
            },
            (error) => {
                console.error('WebSocket connection error:', error);
                this.handleReconnection(notificationCallback);
            }
        );

        this.socketClient.onStompError = (frame) => {
            console.error('WebSocket Stomp error:', frame);
            this.handleReconnection(notificationCallback);
        };
    }


    handleReconnection(notificationCallback) {
        if (this.retryAttempts < this.maxRetries) {
            const retryDelay = Math.min(5000 * 2 ** this.retryAttempts, 30000);
            this.retryAttempts++;
            console.log(`Retrying WebSocket connection in ${retryDelay / 1000} seconds...`);

            setTimeout(() => this.connect(this.keycloak, notificationCallback), retryDelay);
        } else {
            console.error('Max reconnection attempts reached. WebSocket not reconnected.');
        }
    }

    subscribeToNotifications(userId, callback) {
        if (!this.isConnected || !this.socketClient) {
            console.error('WebSocket not connected. Cannot subscribe.');
            return null;
        }

        const subscription = this.socketClient.subscribe(
            `/user/${userId}/notifications`,
            (message) => {
                const notification = JSON.parse(message.body);
                callback(notification);
            }
        );

        console.log('Subscribed to notifications for user:', userId);
        return subscription;
    }

    disconnect() {
        if (this.socketClient) {
            this.socketClient.disconnect(() => {
                console.log('WebSocket disconnected.');
            });
        }
        if (this.ws) {
            this.ws.close();
            console.log('SockJS WebSocket closed.');
        }
    }
}

export default new WebSocketService();
