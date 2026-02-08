import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js', 'resources/css/login.css', 'resources/js/login.js', 'resources/css/office.css', 'resources/js/office.js', 'resources/css/user.css', 'resources/js/user.js', 'resources/css/walkin.css', 'resources/js/walkin.js', 'resources/css/policies.css', 'resources/js/policies.js', 'resources/css/category.css', 'resources/js/category.js', 'resources/css/client.css', 'resources/js/client.js', 'resources/css/series.css', 'resources/js/series.js', 'resources/css/select2search.css', 'resources/css/view.css', 'resources/js/view.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
