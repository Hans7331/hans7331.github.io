let chart = null;

function randn(){
  let u = 0;
  let v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function makeSamples(intercept, slope, noise, n){
  const points = [];
  for(let i = 0; i < n; i++){
    const x = (i / Math.max(1, n - 1)) * 10;
    const jitteredX = Math.max(0, Math.min(10, x + randn() * 0.18));
    const mean = intercept + slope * jitteredX;
    points.push({x: jitteredX, y: mean + randn() * noise});
  }
  return points;
}

function fitLine(points){
  const n = points.length;
  const meanX = points.reduce((sum, p)=>sum + p.x, 0) / n;
  const meanY = points.reduce((sum, p)=>sum + p.y, 0) / n;
  const numerator = points.reduce((sum, p)=>sum + (p.x - meanX) * (p.y - meanY), 0);
  const denominator = points.reduce((sum, p)=>sum + Math.pow(p.x - meanX, 2), 0) || 1;
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  const rmse = Math.sqrt(points.reduce((sum, p)=>sum + Math.pow(p.y - (intercept + slope * p.x), 2), 0) / n);
  return {intercept, slope, rmse};
}

function linePoints(intercept, slope){
  return Array.from({length: 41}, (_, i)=>{
    const x = i / 4;
    return {x, y: intercept + slope * x};
  });
}

function bandPoints(intercept, slope, noise, direction){
  return linePoints(intercept, slope).map((p)=>({x: p.x, y: p.y + direction * 2 * noise}));
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

  const slope = Number(document.getElementById('slope').value);
  const intercept = Number(document.getElementById('intercept').value);
  const noise = Number(document.getElementById('noise').value);
  const n = Number(document.getElementById('sampleSize').value);

  setOutput('slopeValue', slope, 1);
  setOutput('interceptValue', intercept, 1);
  setOutput('noiseValue', noise, 1);
  setText('sampleValue', String(n));

  const points = makeSamples(intercept, slope, noise, n);
  const fit = fitLine(points);
  const fitted = linePoints(fit.intercept, fit.slope);
  const upper = bandPoints(fit.intercept, fit.slope, fit.rmse, 1);
  const lower = bandPoints(fit.intercept, fit.slope, fit.rmse, -1);

  setText('fitEquation', `y = ${fit.intercept.toFixed(2)} + ${fit.slope.toFixed(2)}x`);
  setText('rmse', fit.rmse.toFixed(2));
  setText('prediction', (fit.intercept + fit.slope * 8).toFixed(2));

  const ctx = document.getElementById('gaussianRegressionChart').getContext('2d');
  if(chart) chart.destroy();
  chart = new window.Chart(ctx, {
    data: {
      datasets: [
        {
          type: 'scatter',
          label: 'Observed y',
          data: points,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(12,113,103,.72)',
          pointBorderColor: 'rgba(12,113,103,1)'
        },
        {
          type: 'line',
          label: 'Fitted mean',
          data: fitted,
          parsing: false,
          borderColor: 'rgba(185,84,47,1)',
          borderWidth: 3,
          pointRadius: 0,
          tension: .12
        },
        {
          type: 'line',
          label: '+/- 2 RMSE',
          data: upper,
          parsing: false,
          borderColor: 'rgba(86,101,173,.28)',
          backgroundColor: 'rgba(86,101,173,.10)',
          borderWidth: 1,
          pointRadius: 0,
          fill: '+1',
          tension: .12
        },
        {
          type: 'line',
          label: 'Lower band',
          data: lower,
          parsing: false,
          borderColor: 'rgba(86,101,173,.28)',
          borderWidth: 1,
          pointRadius: 0,
          tension: .12
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {mode: 'nearest', intersect: false},
      plugins: {
        legend: {
          labels: {
            filter: (item)=>item.text !== 'Lower band'
          }
        },
        tooltip: {
          callbacks: {
            label: (context)=>`${context.dataset.label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`
          }
        }
      },
      scales: {
        x: {type: 'linear', min: 0, max: 10, title: {display: true, text: 'x'}},
        y: {title: {display: true, text: 'continuous y'}}
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  window.VizArd.renderKatexElements();
  ['slope', 'intercept', 'noise', 'sampleSize'].forEach((id)=>{
    document.getElementById(id).addEventListener('input', render);
  });
  document.getElementById('resample').addEventListener('click', render);
  render();
});
