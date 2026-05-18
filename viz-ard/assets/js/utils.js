function downloadJSON(obj, filename='data.json'){
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

function renderKatex(elementId){
  const element = document.getElementById(elementId);
  if(!element || !window.katex) return;
  const tex = element.dataset.tex || element.textContent;
  window.katex.render(tex, element, {throwOnError:false});
}

function renderKatexElements(selector='[data-tex]'){
  if(!window.katex) return;
  document.querySelectorAll(selector).forEach((element)=>{
    const tex = element.dataset.tex || element.textContent;
    window.katex.render(tex, element, {throwOnError:false});
  });
}

window.VizArd = {
  ...(window.VizArd || {}),
  downloadJSON,
  renderKatex,
  renderKatexElements
};
