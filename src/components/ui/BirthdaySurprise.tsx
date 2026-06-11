"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";

export function BirthdaySurprise() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const today = new Date();
    const month = today.getMonth(); // 0-indexado
    const day = today.getDate();
    const year = today.getFullYear();

    // Claves únicas por año para que se repita el próximo año, pero solo 1 vez en este año
    const birthdayKey = `birthdaySurpriseShown_${year}`;
    const march17Key = `march17SurpriseShown_${year}`;

    // 1. Easter Egg: Cumpleaños Dra. Joyce (2 de Septiembre)
    const isBirthday = month === 8 && day === 2;

    if (isBirthday && !localStorage.getItem(birthdayKey)) {
      
      const playSurprise = () => {
        // Guardar para que no se repita más en este año/día
        localStorage.setItem(birthdayKey, "true");

        // Reproducir música ahora que el usuario hizo clic
        const audio = new Audio('/cumpleanos.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Navegador bloqueó el autoplay", e));

        // Confeti continuo
        const duration = 5 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#D4AF37', '#FF69B4', '#ff0000', '#ffffff', '#ffd700'], zIndex: 9999 });
          confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#D4AF37', '#FF69B4', '#ff0000', '#ffffff', '#ffd700'], zIndex: 9999 });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();

        setTimeout(() => {
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#D4AF37', '#FF69B4', '#ff0000'], zIndex: 9999 });
        }, 1000);

        // Mensaje final
        Swal.fire({
          title: '<span style="font-size: 2rem; color: #D4AF37; font-weight: bold;">¡Feliz Cumpleaños! 🎉</span><br/><span style="font-size: 1.5rem; color: #FF69B4;">Dra. Joyce Valencia</span>',
          html: `
            <div style="font-size: 1.05rem; line-height: 1.6; color: hsl(var(--foreground)); margin-top: 15px; text-align: justify;">
              <p style="margin-bottom: 12px;">Este mensaje llega desde el pasado, cargado de mucho aprecio y cariño, deseando desde lo más profundo del corazón de tu sistema de Gestión de Pacientes esperando que esta etapa de tu vida sea la más bonita y feliz en compañía de tus familiares y de las personas que amas.</p>
              
              <p style="margin-bottom: 12px; font-style: italic; color: #D4AF37; font-weight: 500; text-align: center;">
                "Sigue adelante. No permitas que tus miedos o debilidades te alejen de tus objetivos o de la gente que amas. Mantén tu corazón ardiendo; no importa qué pase, sigue avanzando. Si te caes, recuerda que el tiempo no espera a nadie, no te hará compañía ni cargará tus penas. No te lamentes por lo que quedó atrás, sino agradece el camino."
              </p>

              <p style="text-align: center; font-weight: bold;">Te deseo muchísimos éxitos y felicidades hoy y siempre.</p>
              <p style="text-align: right; font-size: 0.9rem; margin-top: 15px; color: #FF69B4;">— Atte, tu sistema.</p>
            </div>
          `,
          confirmButtonText: '¡Hasta pronto!',
          confirmButtonColor: '#FF69B4',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          width: '600px',
          showClass: { popup: 'animate__animated animate__zoomIn' },
          hideClass: { popup: 'animate__animated animate__zoomOut' }
        }).then(() => {
          // Detener la música al cerrar el popup
          audio.pause();
          audio.currentTime = 0;
        });
      };

      // Pantalla inicial para capturar interacción
      Swal.fire({
        title: 'Tienes un mensaje nuevo',
        text: 'Este mensaje se reproducirá una sola vez',
        icon: 'info',
        confirmButtonText: 'Abrir mensaje',
        confirmButtonColor: '#D4AF37',
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          playSurprise();
        }
      });
    }

    // 2. Easter Egg: Día ordinario (17 de Marzo)
    const isMarch17 = month === 2 && day === 17;

    if (isMarch17 && !localStorage.getItem(march17Key)) {
      
      const playMarchSurprise = () => {
        localStorage.setItem(march17Key, "true");

        // Reproducir la misma música
        const audio = new Audio('/cumpleanos.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Navegador bloqueó el autoplay", e));

        Swal.fire({
          title: 'Recordatorio',
          text: 'Hoy 17 de marzo es un día como cualquier otro en este y en todos los universos posibles. Que tengas un buen día.',
          icon: 'info',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#D4AF37',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          iconColor: '#6B7280'
        }).then(() => {
          // Detener la música al cerrar el popup
          audio.pause();
          audio.currentTime = 0;
        });
      };

      // Pantalla inicial para capturar interacción
      Swal.fire({
        title: 'Mensaje del sistema',
        text: 'Tienes una nueva notificación.',
        icon: 'question',
        confirmButtonText: 'Ver notificación',
        confirmButtonColor: '#D4AF37',
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          playMarchSurprise();
        }
      });
    }

  }, [mounted]);

  return null;
}
