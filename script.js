document.addEventListener('DOMContentLoaded', function() {
    // --- ¡IMPORTANTE! EDITA ESTA FECHA Y HORA ---
    // Define la fecha y hora objetivo. Usa el formato 'Año-Mes-DíaTHora:Minuto:Segundo'
    // Ejemplo: '2026-12-31T23:59:59' para el 31 de diciembre de 2026 a las 23:59:59
    // Para Posadas, Misiones, Argentina, la hora que coloques será interpretada en tu zona horaria local.
    // Asumiendo que tu "cuando sale Cristina" tiene una fecha específica, por ejemplo, el 10 de diciembre de 2027 a las 17:00:00 (5 PM).
    const targetDate = new Date('2031-06-17T17:00:00').getTime(); // ¡CAMBIA ESTA FECHA Y HORA!

    // Obtener los elementos HTML por su ID para actualizar sus contenidos
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const messageElement = document.getElementById('countdown-message');
    const countdownContainer = document.getElementById('countdown'); // Referencia al contenedor completo del contador

    function updateCountdown() {
        const now = new Date().getTime(); // Obtiene la hora actual en milisegundos
        const distance = targetDate - now; // Calcula la diferencia en milisegundos

        // Si el contador ha llegado a cero o ya pasó la fecha objetivo
        if (distance < 0) {
            clearInterval(countdownInterval); // Detiene el contador para que no siga actualizándose
            countdownContainer.style.display = 'none'; // Oculta los números del contador
            messageElement.textContent = '¡El momento ha llegado! ¡Celebremos!'; // Muestra un mensaje final
            messageElement.style.color = '#ffcc00'; // Asegura que el mensaje final tenga color
            return; // Sale de la función
        }

        // Cálculos para convertir milisegundos en días, horas, minutos y segundos
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Función auxiliar para actualizar el valor y aplicar la animación
        function updateAndAnimate(element, newValue) {
            const formattedValue = String(newValue).padStart(2, '0');
            const currentValue = element.textContent;

            // Solo actualiza y anima si el valor ha cambiado
            if (currentValue !== formattedValue) {
                element.textContent = formattedValue;
                // Añade la clase para la animación
                element.classList.add('tick-animation');
                // Elimina la clase después de que la animación termine para poder reutilizarla
                element.addEventListener('animationend', function() {
                    element.classList.remove('tick-animation');
                }, { once: true }); // 'once: true' asegura que el listener se elimine solo
            }
        }

        updateAndAnimate(daysElement, days);
        updateAndAnimate(hoursElement, hours);
        updateAndAnimate(minutesElement, minutes);
        updateAndAnimate(secondsElement, seconds);
    }

    // Llama a la función una vez al inicio para que el contador se muestre inmediatamente
    // y no haya un breve lapso de "00" antes de la primera actualización.
    updateCountdown();

    // Configura el contador para que se actualice cada 1 segundo (1000 milisegundos)
    const countdownInterval = setInterval(updateCountdown, 1000);
});