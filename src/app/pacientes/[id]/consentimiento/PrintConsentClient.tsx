"use client";

import { useEffect } from "react";

export function PrintConsentClient() {
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.backgroundColor = 'white';
    
    setTimeout(() => {
      window.print();
    }, 500);

    return () => {
      document.body.style.overflow = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  return null;
}
