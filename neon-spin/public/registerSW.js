/* Service worker registration (static fallback; vite-plugin-pwa may omit this file with Rolldown). */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
