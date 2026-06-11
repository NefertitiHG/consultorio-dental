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
    // Meses en JS son 0-indexados: Enero=0, ..., Septiembre=8
    const isBirthday = today.getMonth() === 8 && today.getDate() === 2;

    // Para probar la funcionalidad en cualquier fecha, cambiar `isBirthday` a `true` temporalmente
    // const isBirthday = true; 

    if (isBirthday && !sessionStorage.getItem("birthdaySurpriseShown")) {
      sessionStorage.setItem("birthdaySurpriseShown", "true");

      // Función para lanzar confeti continuo durante 5 segundos
      const duration = 5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        // Confeti desde la izquierda
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#D4AF37', '#FF69B4', '#ff0000', '#ffffff', '#ffd700'],
          zIndex: 9999
        });
        // Confeti desde la derecha
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#D4AF37', '#FF69B4', '#ff0000', '#ffffff', '#ffd700'],
          zIndex: 9999
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      // Iniciar el efecto de partículas
      frame();

      // Lanzar algunos "fuegos artificiales" (Confeti centrado)
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FF69B4', '#ff0000'],
          zIndex: 9999
        });
      }, 1000);

      // Mostrar el mensaje en pantalla
      Swal.fire({
        title: '<span style="font-size: 2rem; color: #D4AF37;">¡Feliz Cumpleaños! 🎉💐</span>',
        html: `
          <div style="font-size: 1.1rem; line-height: 1.6; color: hsl(var(--foreground)); margin-top: 10px;">
            <p>Hoy es un día muy especial.</p>
            <p>De parte de las personas que más te estiman (y del sistema que te acompaña todos los días), te deseamos el más maravilloso de los cumpleaños.</p>
            <br/>
            <p><strong>🌸 ¡Que este año esté lleno de sonrisas, éxito y muchos sueños cumplidos! 🌸</strong></p>
          </div>
        `,
        confirmButtonText: '¡Gracias! 💖',
        confirmButtonColor: '#FF69B4', // Un rosa bonito en lugar de dorado normal para darle un toque especial
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        showClass: {
          popup: 'animate__animated animate__zoomIn' // Si tienen animate.css, si no, igual hace fade por defecto
        },
        hideClass: {
          popup: 'animate__animated animate__zoomOut'
        }
      });
    }
  }, [mounted]);

  return null;
}
