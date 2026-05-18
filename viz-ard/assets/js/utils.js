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

if(window.Chart){
  window.Chart.defaults.color = '#b8c4d6';
  window.Chart.defaults.borderColor = 'rgba(154,168,187,.22)';
  window.Chart.defaults.plugins.legend.labels.color = '#b8c4d6';
  window.Chart.defaults.plugins.tooltip.backgroundColor = '#0d1421';
  window.Chart.defaults.plugins.tooltip.borderColor = '#273244';
  window.Chart.defaults.plugins.tooltip.borderWidth = 1;
  window.Chart.defaults.plugins.tooltip.titleColor = '#edf3fb';
  window.Chart.defaults.plugins.tooltip.bodyColor = '#edf3fb';
}

window.VizArd = {
  ...(window.VizArd || {}),
  downloadJSON,
  renderKatex,
  renderKatexElements
};
