<h2>Docker:</h2>
<ul>
<li><code>docker-compose up --build</code></li>
<li><code>docker exec -it your-app-container-name php artisan migrate</code></li>
<li>Access your application by visiting <a href="http://localhost:3000/">http://localhost:3000/</a></li>
</ul>

<h2>Starting Laravel Manually:</h2>
<ul>
<li><code>composer install</code></li>
<li>Create an environment file (`.env`) with your application's configuration. You can copy `.env.example` and modify it with your settings.</li>
<li><code>php artisan key:generate</code> - This generates a unique application key for security.</li>
<li><code>php artisan migrate</code> - Run migrations to create the required database tables.</li>
<li><code>php artisan serve</code> - Start a local development server for your Laravel application.</li>
<li><code>php artisan websockets:serve</code> - If you're using Laravel WebSockets, start the WebSocket server.</li>
<li>For the front end, navigate to the "front" directory:</li>
<ul>
<li><code>cd front</code></li>
<li><code>npm install</code> - Install JavaScript dependencies using Node Package Manager (NPM).</li>
<li><code>npm run dev</code> - Compile and build the front-end assets.</li>
</ul>
</ul>
