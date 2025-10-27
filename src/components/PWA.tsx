'use client';

import { useEffect } from 'react';

export default function PWA() {
  useEffect(() => {
    // Unregister any existing service workers during development
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then(() => {
            console.log('Service Worker unregistered');
          });
        });
      });
    }

    // Uncomment below to enable PWA in production
    /*
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
    */
  }, []);

  return null;
}