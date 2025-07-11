document.addEventListener('DOMContentLoaded', function () {
    // --- INICIO: Lógica del contador ---
    const countdownContainer = document.getElementById('countdown');
    const messageElement = document.getElementById('countdown-message');
    const originalTitle = document.title; // Guardar el título original

    if (!countdownContainer) return; // Salir si el elemento principal no existe.

    // Obtener la fecha objetivo desde el atributo data- en el HTML
    const targetDateString = countdownContainer.dataset.targetDate;
    if (!targetDateString) {
        console.error('Error: El atributo data-target-date no está definido en el elemento #countdown.');
        countdownContainer.style.display = 'none';
        if (messageElement) messageElement.textContent = 'Error de configuración.';
        return; // Detener la ejecución si no hay fecha
    }

    const startDateString = countdownContainer.dataset.startDate;
    if (!startDateString) {
        console.error('Error: El atributo data-start-date no está definido en el elemento #countdown.');
        // No detenemos la ejecución, el contador puede funcionar sin la barra de progreso.
    }

    const targetDate = new Date(targetDateString).getTime();
    const startDate = startDateString ? new Date(startDateString).getTime() : new Date().getTime();
    const totalDuration = targetDate - startDate;

    // Obtener los elementos HTML
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            if (progressText) progressText.textContent = '100.00%';
            if (progressBar) progressBar.style.width = '100%'; // Llenar la barra al llegar a cero
            clearInterval(countdownInterval);
            if (countdownContainer) countdownContainer.style.display = 'none';
            if (messageElement) {
                messageElement.textContent = '¡El momento ha llegado! ¡Celebremos!';
                messageElement.style.color = '#ffcc00';
            }
            document.title = '¡Llegó el día! | ' + originalTitle;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Actualizar el título de la página dinámicamente
        const fHours = String(hours).padStart(2, '0');
        const fMinutes = String(minutes).padStart(2, '0');
        const fSeconds = String(seconds).padStart(2, '0');
        document.title = `${days}d ${fHours}h ${fMinutes}m ${fSeconds}s | ${originalTitle}`;

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

        // Actualizar la barra de progreso
        if (progressBar && totalDuration > 0) {
            const elapsed = now - startDate;
            let progressPercentage = (elapsed / totalDuration) * 100;
            // Asegurar que el porcentaje esté entre 0 y 100
            progressPercentage = Math.max(0, Math.min(100, progressPercentage));
            progressBar.style.width = progressPercentage + '%';
            if (progressText) {
                progressText.textContent = progressPercentage.toFixed(2) + '%';
            }
        }
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

    // --- INICIO: Lógica de fondo dinámico ---
    const backgroundColors = [
        '#282c34',
        '#34282c',
        '#283430',
        '#2c2834'
    ];
    let colorIndex = 0;

    setInterval(() => {
        colorIndex = (colorIndex + 1) % backgroundColors.length;
        document.body.style.backgroundColor = backgroundColors[colorIndex];
    }, 20000); // Cambia de color cada 20 segundos para un efecto sutil
    // --- FIN: Lógica de fondo dinámico ---

    // --- INICIO: Lógica de Likes ---
    const likeBtn = document.getElementById('like-btn');
    const likeCountSpan = document.getElementById('like-count');
    // La ruta a la carpeta donde están tus archivos PHP
    const likeApiUrl = './api/';

    // Función para obtener el contador inicial de likes
    async function getInitialLikes() {
        try {
            const response = await fetch(`${likeApiUrl}get_count.php`);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            if (data.success) {
                likeCountSpan.textContent = data.count.toLocaleString('es');
            }
        } catch (error) {
            console.error("Error al obtener los likes:", error);
        }
    }

    // Función para enviar un like
    async function handleLike() {
        // Deshabilitamos el botón para evitar clics múltiples
        likeBtn.disabled = true;
        likeBtn.classList.add('liked');

        try {
            const response = await fetch(`${likeApiUrl}increment_count.php`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            if (data.success) {
                likeCountSpan.textContent = data.count.toLocaleString('es');
                // Guardamos en el navegador que el usuario ya dio like para no dejarle dar de nuevo
                localStorage.setItem('userHasLiked', 'true');
            }
        } catch (error) {
            console.error("Error al enviar el like:", error);
            // Si algo falla, volvemos a habilitar el botón
            likeBtn.disabled = false;
            likeBtn.classList.remove('liked');
        }
    }

    // Verificamos si el usuario ya dio like en una visita anterior
    if (localStorage.getItem('userHasLiked') === 'true') {
        likeBtn.disabled = true;
        likeBtn.classList.add('liked');
    } else {
        likeBtn.addEventListener('click', handleLike);
    }

    // Cargamos el contador de likes al iniciar
    getInitialLikes();
    // --- FIN: Lógica de Likes ---

});