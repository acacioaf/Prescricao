self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
});

self.addEventListener('fetch', (event) => {
    // Obrigatório para o Chrome mostrar o botão de instalar
});
