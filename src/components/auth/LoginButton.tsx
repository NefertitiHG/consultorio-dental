"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button 
      onClick={() => signIn("google", { callbackUrl: "/" })} 
      className="px-6 py-3 rounded-md bg-gold text-primary-foreground font-semibold hover:bg-accent transition-colors"
    >
      Iniciar Sesión con Google
    </button>
  );
}
