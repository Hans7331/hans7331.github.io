// Minimal main script: could add analytics, prefetch, etc.
document.addEventListener('DOMContentLoaded', ()=>{
  // small enhancement: add keyboard focus styles when navigating via keyboard
  document.body.addEventListener('keydown',(e)=>{if(e.key==='Tab')document.body.classList.add('show-focus')} )
})
