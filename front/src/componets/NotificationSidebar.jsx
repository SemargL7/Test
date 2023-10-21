import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const NotificationSidebar = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
            httpHost: import.meta.env.VITE_PUSHER_HOST,
            wsHost: import.meta.env.VITE_PUSHER_HOST
                ? import.meta.env.VITE_PUSHER_HOST
                : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
            wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
            wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
            forceTLS: false,
            disableStatus: true,
        });
        const channel = pusher.subscribe('comment-store');

        channel.bind('comment-event', function (data) {
            console.log('Received event with data:', data);
            addNotification(data);
        });

        return () => {
            pusher.unsubscribe('comment-store');
            pusher.disconnect();
        };
    }, []);

    const addNotification = (message) => {
        setNotifications((prevNotifications) => {
            const newNotification = {
                id: Date.now(),
                message,
            };
            return [...prevNotifications, newNotification];
        });
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <div className="notification-sidebar">
            <h2>New messages</h2>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>
                        <div className="message">
                            <div className="message-header">
                                <div>
                                    <strong>{notification.message[0].user_name}</strong>
                                </div>
                                <div className="message-date">
                                    {formatDate(notification.message[0].updated_at)}
                                </div>
                                <div>
                                    {notification.message[0].email}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default NotificationSidebar;
