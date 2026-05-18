const outcomes = [6, 7, 8, 9, 10, 12, 15, 18, 22];

function pinballLoss(tau, actual, prediction){
  const residual = actual - prediction;
  return Math.max(tau * residual, (tau - 1) * residual);
}

function setText(id, text){
  const element = document.getElementById(id);
  if(element) element.textContent = text;
}

function renderBars(containerId, values, className){
  const container = document.getElementById(containerId);
  const maxValue = Math.max(...values, 1);
  container.innerHTML = '';
  values.forEach((value)=>{
    const bar = document.createElement('div');
    bar.className = `loss-stick ${className}`;
    bar.style.height = `${Math.max(8, (value / maxValue) * 145)}px`;
    bar.title = value.toFixed(2);
    container.appendChild(bar);
  });
}

function render(){
  const tau = Number(document.getElementById('tau').value);
  const prediction = Number(document.getElementById('prediction').value);
  const losses = outcomes.map((actual)=>pinballLoss(tau, actual, prediction));
  const totalLoss = losses.reduce((sum, value)=>sum + value, 0);

  setText('tauValue', tau.toFixed(2));
  setText('predictionValue', prediction.toFixed(1));
  setText('totalLoss', totalLoss.toFixed(2));

  const tail = tau > .65 ? 'upper tail' : tau < .35 ? 'lower tail' : 'middle of the distribution';
  setText('quantileSummary', `Tau ${tau.toFixed(2)} asks the model to fit the ${tail}. With y-hat at ${prediction.toFixed(1)}, the asymmetric loss decides whether the prediction should move up or down.`);

  renderBars('actualBars', outcomes, 'indigo');
  renderBars('lossBars', losses, 'rust');
}

document.addEventListener('DOMContentLoaded', ()=>{
  window.VizArd.renderKatexElements();
  ['tau', 'prediction'].forEach((id)=>{
    document.getElementById(id).addEventListener('input', render);
  });
  render();
});
