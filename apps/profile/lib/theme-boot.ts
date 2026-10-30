/**
 * Runs in <head> before the page paints: marks that scripts run (so scroll
 * reveals may start hidden) and applies a saved light or dark choice, so it
 * never flashes. A plain module, so the server layout gets the string itself.
 */
export const themeBoot = `document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`
