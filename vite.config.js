import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js', 'resources/css/office.css', 'resources/js/office.js', 'resources/css/user.css', 'resources/js/user.js', 'resources/css/walkin.css', 'resources/js/walkin.js', 'resources/css/policies.css', 'resources/js/policies.js', 'resources/css/category.css', 'resources/js/category.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
