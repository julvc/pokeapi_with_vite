import { defineConfig } from 'vite';

export default defineConfig({
    base: '/pokeapi_with_vite/', // Cambia por el nombre de tu repositorio
    build: {
        rollupOptions: {
            output: {
                inlineDynamicImports: false, // Asegura que los scripts no sean en línea
            },
        },
    },
});