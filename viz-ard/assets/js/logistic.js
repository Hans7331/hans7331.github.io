function sigmoid(value){
  return 1 / (1 + Math.exp(-value));
}

function setText(id, text){
  const element = document.getElementById(id);
  if(element) element.textContent = text;
}

function setOutput(id, value, digits=1){
  setText(id, Number(value).toFixed(digits));
}

function render(){
  const x = Number(document.getElementById('x').value);
  const intercept = Number(document.getElementById('intercept').value);
  const slope = Number(document.getElementById('slope').value);
  const threshold = Number(document.getElementById('threshold').value);
  const score = intercept + slope * x;
  const probability = sigmoid(score);
  const decision = probability >= threshold ? 1 : 0;

  setOutput('xValue', x);
  setOutput('interceptValue', intercept);
  setOutput('slopeValue', slope);
  setText('thresholdValue', threshold.toFixed(2));
  setText('logOdds', score.toFixed(2));
  setText('odds', Math.exp(score).toFixed(2));
  setText('probabilityHeadline', `${Math.round(probability * 100)}% probability`);
  setText('probabilityCopy', `At x = ${x.toFixed(1)}, the model predicts class ${decision} with threshold ${threshold.toFixed(2)}.`);

  document.getElementById('probabilityFill').style.width = `${probability * 100}%`;
  document.getElementById('negativeBox').classList.toggle('active', decision === 0);
  document.getElementById('positiveBox').classList.toggle('active', decision === 1);
}

document.addEventListener('DOMContentLoaded', ()=>{
  window.VizArd.renderKatexElements();
  ['x', 'intercept', 'slope', 'threshold'].forEach((id)=>{
    document.getElementById(id).addEventListener('input', render);
  });
  render();
});
