document.addEventListener('DOMContentLoaded', function() {
    // --- INICIO: Lógica del contador (antes en script.js) ---
    // Define la fecha y hora objetivo.
    const targetDate = new Date('2031-06-17T17:00:00').getTime(); // ¡CAMBIA ESTA FECHA Y HORA!

    // Obtener los elementos HTML
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const messageElement = document.getElementById('countdown-message');
    const countdownContainer = document.getElementById('countdown');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            if (countdownContainer) countdownContainer.style.display = 'none';
            if (messageElement) {
                messageElement.textContent = '¡El momento ha llegado! ¡Celebremos!';
                messageElement.style.color = '#ffcc00';
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        function updateAndAnimate(element, newValue) {
            // Salir si el elemento no existe en la página
            if (!element) return;
            
            const formattedValue = String(newValue).padStart(2, '0');
            if (element.textContent !== formattedValue) {
                element.textContent = formattedValue;
                element.classList.add('tick-animation');
                element.addEventListener('animationend', () => {
                    element.classList.remove('tick-animation');
                }, { once: true });
            }
        }

        updateAndAnimate(daysElement, days);
        updateAndAnimate(hoursElement, hours);
        updateAndAnimate(minutesElement, minutes);
        updateAndAnimate(secondsElement, seconds);
    }

    // Iniciar el contador
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Llamada inicial para evitar el retraso de 1s
    // --- FIN: Lógica del contador ---

    // --- INICIO: Lógica de compartir (antes en share.js) ---
    const copyBtn = document.getElementById('copyLinkBtn');
    const copyMessage = document.getElementById('copy-message');

    if (copyBtn && copyMessage) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('https://cuandosalecristina.com/').then(() => {
                copyMessage.textContent = '¡Enlace copiado!';
                setTimeout(() => { copyMessage.textContent = ''; }, 2500);
            }).catch(err => {
                console.error('Error al copiar el enlace: ', err);
                copyMessage.textContent = 'Error al copiar';
            });
        });
    }

    const whatsappBtn = document.getElementById('whatsapp-share-btn');
    if (whatsappBtn) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const text = '¡La cuenta regresiva más esperada! ⏳ Entérate cuánto falta para que salga Cristina. https://cuandosalecristina.com/';
        const encodedText = encodeURIComponent(text);
        whatsappBtn.href = isMobile ? `https://api.whatsapp.com/send?text=${encodedText}` : `https://web.whatsapp.com/send?text=${encodedText}`;
    }
    // --- FIN: Lógica de compartir ---
});