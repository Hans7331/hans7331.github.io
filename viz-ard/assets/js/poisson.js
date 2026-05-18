let chart = null;

function samplePoisson(lambda){
  const limit = Math.exp(-lambda);
  let k = 0;
  let product = 1;
  do{
    k += 1;
    product *= Math.random();
  }while(product > limit);
  return k - 1;
}

function makeSamples(baseline, slope, exposure, n){
  const intercept = Math.log(baseline);
  const points = [];
  for(let i = 0; i < n; i++){
    const x = (i / Math.max(1, n - 1)) * 10;
    const lambda = exposure * Math.exp(intercept + slope * x);
    points.push({x, y: samplePoisson(lambda), lambda});
  }
  return points;
}

function meanCurve(baseline, slope, exposure){
  const intercept = Math.log(baseline);
  return Array.from({length: 61}, (_, i)=>{
    const x = i / 6;
    return {x, y: exposure * Math.exp(intercept + slope * x)};
  });
}

function setText(id, text){
  const element = document.getElementById(id);
  if(element) element.textContent = text;
}

function setOutput(id, value, digits=1){
  setText(id, Number(value).toFixed(digits));
}

function render(){
  if(!window.Chart) throw new Error('Chart.js did not load.');

  const baseline = Number(document.getElementById('baseline').value);
  const slope = Number(document.getElementById('rateSlope').value);
  const exposure = Number(document.getElementById('exposure').value);
  const n = Number(document.getElementById('observationCount').value);

  setOutput('baselineValue', baseline, 1);
  setOutput('rateSlopeValue', slope, 2);
  setOutput('exposureValue', exposure, 1);
  setText('countValue', String(n));

  const points = makeSamples(baseline, slope, exposure, n);
  const curve = meanCurve(baseline, slope, exposure);
  const predictedAtTen = curve[curve.length - 1].y;
  const meanPredicted = curve.reduce((sum, p)=>sum + p.y, 0) / curve.length;

  setText('rateRatio', Math.exp(slope).toFixed(2));
  setText('meanCount', meanPredicted.toFixed(2));
  setText('countPrediction', predictedAtTen.toFixed(2));

  const ctx = document.getElementById('poissonRegressionChart').getContext('2d');
  if(chart) chart.destroy();
  chart = new window.Chart(ctx, {
    data: {
      datasets: [
        {
          type: 'scatter',
          label: 'Observed counts',
          data: points,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(185,84,47,.72)',
          pointBorderColor: 'rgba(185,84,47,1)'
        },
        {
          type: 'line',
          label: 'Expected count',
          data: curve,
          parsing: false,
          borderColor: 'rgba(12,113,103,1)',
          borderWidth: 3,
          pointRadius: 0,
          tension: .2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {mode: 'nearest', intersect: false},
      plugins: {
        tooltip: {
          callbacks: {
            label: (context)=>`${context.dataset.label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`
          }
        }
      },
      scales: {
        x: {type: 'linear', min: 0, max: 10, title: {display: true, text: 'x'}},
        y: {beginAtZero: true, title: {display: true, text: 'count'}}
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  window.VizArd.renderKatexElements();
  ['baseline', 'rateSlope', 'exposure', 'observationCount'].forEach((id)=>{
    document.getElementById(id).addEventListener('input', render);
  });
  document.getElementById('resample').addEventListener('click', render);
  render();
});
