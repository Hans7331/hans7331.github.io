const tokens = ['The', 'bank', 'raised', 'rates', 'after', 'inflation', 'rose'];
const baseScores = [
  [.7, .3, .2, .1, .1, .1, .1],
  [.2, .8, .35, .3, .2, .25, .2],
  [.2, .65, .7, .55, .25, .35, .28],
  [.1, .45, .35, .75, .3, .7, .4],
  [.1, .2, .25, .35, .6, .45, .55],
  [.1, .35, .3, .85, .45, .75, .65],
  [.1, .2, .28, .35, .5, .75, .7]
];

function softmax(values, sharpness){
  const scaled = values.map((value)=>value * sharpness * 4);
  const maxValue = Math.max(...scaled);
  const exps = scaled.map((value)=>Math.exp(value - maxValue));
  const total = exps.reduce((sum, value)=>sum + value, 0);
  return exps.map((value)=>value / total);
}

function setText(id, text){
  const element = document.getElementById(id);
  if(element) element.textContent = text;
}

function setupOptions(){
  const select = document.getElementById('focusToken');
  select.innerHTML = tokens.map((token, index)=>`<option value="${index}">${index + 1}. ${token}</option>`).join('');
  select.value = '3';
}

function render(){
  const focus = Number(document.getElementById('focusToken').value);
  const sharpness = Number(document.getElementById('sharpness').value);
  const weights = softmax(baseScores[focus], sharpness);
  const table = document.getElementById('attentionTable');
  const strongest = weights.reduce((best, value, index)=>value > weights[best] ? index : best, 0);

  setText('sharpnessValue', sharpness.toFixed(1));
  setText('strongestLink', tokens[strongest]);

  table.innerHTML = `
    <thead>
      <tr><th>focus</th>${tokens.map((token)=>`<th>${token}</th>`).join('')}</tr>
    </thead>
    <tbody>
      <tr>
        <th>${tokens[focus]}</th>
        ${weights.map((weight)=>{
          const alpha = Math.max(.08, weight);
          return `<td style="background:rgba(8,121,111,${alpha});color:${weight > .22 ? '#fff' : '#17201d'}">${weight.toFixed(2)}</td>`;
        }).join('')}
      </tr>
    </tbody>
  `;
}

document.addEventListener('DOMContentLoaded', ()=>{
  window.VizArd.renderKatexElements();
  setupOptions();
  ['focusToken', 'sharpness'].forEach((id)=>{
    document.getElementById(id).addEventListener('input', render);
    document.getElementById(id).addEventListener('change', render);
  });
  render();
});
