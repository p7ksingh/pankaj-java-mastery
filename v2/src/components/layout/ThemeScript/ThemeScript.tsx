/**
 * Inline script that sets the theme class on <html> before React hydrates.
 * Prevents flash of wrong theme and hydration mismatch.
 * Rendered as a blocking <script> in <head>.
 */
export function ThemeScript() {
  const script = `
(function(){
  try {
    var m = localStorage.getItem('javabypankaj.theme');
    var dark = m === 'dark' || (m === 'auto' && window.matchMedia('(prefers-color-scheme:dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch(e) {}
})();
`.trim()

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
