const features = [
  {name: 'size', base: 2.8, color: 'teal'},
  {name: 'location', base: 2.2, color: 'rust'},
  {name: 'age', base: -1.1, color: 'indigo'},
  {name: 'traffic', base: 1.5, color: 'gold'},
  {name: 'noise feature', base: .55, color: 'rose'}
];

function setText(id, text){
  const element = document.getElementById(id);
  if(element) element.textContent = text;
}

function render(){
  const lambda = Number(document.getElementById('lambda').value);
  const correlation = Number(document.getElementById('correlation').value);
  const list = document.getElementById('coefficientList');
  const shrink = 1 / (1 + lambda * (0.16 + correlation * 0.14));

  setText('lambdaValue', lambda.toFixed(1));
  setText('correlationValue', correlation.toFixed(2));

  const ridgeValues = features.map((feature, index)=>{
    const instability = 1 + correlation * (index % 2 === 0 ? .55 : -.35);
    return feature.base * instability * shrink;
  });

  const norm = Math.sqrt(ridgeValues.reduce((sum, value)=>sum + value * value, 0));
  const df = features.length * shrink;
  setText('coefNorm', norm.toFixed(2));
  setText('degreesFreedom', df.toFixed(2));

  list.innerHTML = '';
  features.forEach((feature, index)=>{
    const raw = feature.base * (1 + correlation * (index % 2 === 0 ? .55 : -.35));
    const ridge = ridgeValues[index];
    const maxWidth = Math.max(12, Math.min(100, Math.abs(raw) * 26));
    const ridgeWidth = Math.max(8, Math.min(100, Math.abs(ridge) * 26));
    const card = document.createElement('div');
    card.className = 'bar-card';
    card.innerHTML = `
      <strong>${feature.name}</strong>
      <span>OLS ${raw.toFixed(2)} -> ridge ${ridge.toFixed(2)}</span>
      <div class="bar-track"><div class="bar-fill ${feature.color}" style="width:${maxWidth}%"></div></div>
      <div class="bar-track"><div class="bar-fill ${feature.color}" style="width:${ridgeWidth}%"></div></div>
    `;
    list.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  window.VizArd.renderKatexElements();
  ['lambda', 'correlation'].forEach((id)=>{
    document.getElementById(id).addEventListener('input', render);
  });
  render();
});
