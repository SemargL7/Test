import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import CommentApp from "./CommentApp.jsx";

// import Echo from 'laravel-echo';
//
// import Pusher from 'pusher-js';
// window.Pusher = Pusher;
//
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//     wsHost: import.meta.env.VITE_PUSHER_HOST,
//     wsPort: import.meta.env.VITE_PUSHER_PORT,
//     forceTLS: false,
//     disableStats: true,
// });
// console.log(window.Echo)
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CommentApp/>
    </React.StrictMode>,
)
