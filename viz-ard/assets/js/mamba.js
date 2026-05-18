const sequences = {
  topic: [
    ['intro', .2],
    ['pricing', .8],
    ['pricing', .9],
    ['support', -.45],
    ['support', -.55]
  ],
  code: [
    ['define x', .6],
    ['loop', .2],
    ['update x', .85],
    ['branch', -.15],
    ['return x', .7]
  ],
  noise: [
    ['signal', .9],
    ['noise', -.2],
    ['noise', .1],
    ['signal', .8],
    ['signal', .75]
  ]
};

function setText(id, text){
  const element = document.getElementById(id);
  if(element) element.textContent = text;
}

function render(){
  const sequenceKey = document.getElementById('sequence').value;
  const retention = Number(document.getElementById('retention').value);
  const gate = Number(document.getElementById('gate').value);
  const row = document.getElementById('stateRow');
  let state = 0;

  setText('retentionValue', retention.toFixed(2));
  setText('gateValue', gate.toFixed(2));
  row.innerHTML = '';

  sequences[sequenceKey].forEach(([token, value], index)=>{
    const previous = state;
    state = retention * state + gate * value;
    const card = document.createElement('article');
    card.className = 'state-card';
    card.innerHTML = `
      <span>step ${index + 1}</span>
      <h3>${token}</h3>
      <div class="state-value">${state.toFixed(2)}</div>
      <p>${previous.toFixed(2)} retained + input ${value.toFixed(2)}</p>
    `;
    row.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  window.VizArd.renderKatexElements();
  ['sequence', 'retention', 'gate'].forEach((id)=>{
    document.getElementById(id).addEventListener('input', render);
    document.getElementById(id).addEventListener('change', render);
  });
  render();
});
