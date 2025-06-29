document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para el botón de copiar enlace ---
    const copyBtn = document.getElementById('copyLinkBtn');
    const copyMessage = document.getElementById('copy-message');

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            // Usamos la URL canónica para asegurar que siempre se copie la correcta.
            navigator.clipboard.writeText('https://cuandosalecristina.com/').then(() => {
                copyMessage.textContent = '¡Enlace copiado!';
                setTimeout(() => {
                    copyMessage.textContent = '';
                }, 2500);
            }).catch(err => {
                console.error('Error al copiar el enlace: ', err);
                copyMessage.textContent = 'Error al copiar';
            });
        });
    }

    // --- Lógica para el botón de WhatsApp (distingue móvil de escritorio) ---
    const whatsappBtn = document.getElementById('whatsapp-share-btn');
    if (whatsappBtn) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const text = '¡La cuenta regresiva más esperada! ⏳ Entérate cuánto falta para que salga Cristina. https://cuandosalecristina.com/';
        const encodedText = encodeURIComponent(text);
        
        whatsappBtn.href = isMobile ? `https://api.whatsapp.com/send?text=${encodedText}` : `https://web.whatsapp.com/send?text=${encodedText}`;
    }
});