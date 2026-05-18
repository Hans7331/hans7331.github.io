const prompts = {
  code: {
    tokens: ['Write', 'a', 'Python', 'function', 'to'],
    logits: [
      ['sort', 3.2],
      ['calculate', 2.6],
      ['read', 1.9],
      ['print', 1.2],
      ['the', .8]
    ]
  },
  story: {
    tokens: ['The', 'old', 'telescope', 'revealed'],
    logits: [
      ['a', 2.7],
      ['distant', 2.4],
      ['that', 1.6],
      ['nothing', 1.1],
      ['Mars', .7]
    ]
  },
  math: {
    tokens: ['The', 'derivative', 'of', 'x', 'squared', 'is'],
    logits: [
      ['2x', 4.1],
      ['x', 1.4],
      ['x^2', .9],
      ['constant', .3],
      ['zero', .1]
    ]
  }
};

function softmax(logits, temperature){
  const scaled = logits.map(([, logit])=>logit / temperature);
  const maxLogit = Math.max(...scaled);
  const exps = scaled.map((value)=>Math.exp(value - maxLogit));
  const total = exps.reduce((sum, value)=>sum + value, 0);
  return logits.map(([token], index)=>({token, probability: exps[index] / total}));
}

function setText(id, text){
  const element = document.getElementById(id);
  if(element) element.textContent = text;
}

function render(sample=false){
  const promptKey = document.getElementById('prompt').value;
  const temperature = Number(document.getElementById('temperature').value);
  const prompt = prompts[promptKey];
  const probabilities = softmax(prompt.logits, temperature);
  const tokenStream = document.getElementById('tokenStream');
  const tokenOptions = document.getElementById('tokenOptions');

  setText('temperatureValue', temperature.toFixed(1));
  tokenStream.innerHTML = prompt.tokens.map((token)=>`<span class="token">${token}</span>`).join('');
  tokenOptions.innerHTML = '';

  probabilities.forEach((item, index)=>{
    const card = document.createElement('div');
    card.className = 'token-card';
    card.innerHTML = `
      <strong>${item.token}</strong>
      <span>${Math.round(item.probability * 100)}%</span>
      <div class="bar-track"><div class="bar-fill ${index === 0 ? 'indigo' : ''}" style="width:${item.probability * 100}%"></div></div>
    `;
    tokenOptions.appendChild(card);
  });

  if(sample){
    let cursor = Math.random();
    const picked = probabilities.find((item)=>{
      cursor -= item.probability;
      return cursor <= 0;
    }) || probabilities[probabilities.length - 1];
    setText('selectedToken', picked.token);
  }else{
    setText('selectedToken', probabilities[0].token);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  window.VizArd.renderKatexElements();
  ['prompt', 'temperature'].forEach((id)=>{
    document.getElementById(id).addEventListener('input', ()=>render(false));
    document.getElementById(id).addEventListener('change', ()=>render(false));
  });
  document.getElementById('sample').addEventListener('click', ()=>render(true));
  render(false);
});
