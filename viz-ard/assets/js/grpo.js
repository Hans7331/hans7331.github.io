const sampleTexts = [
  'Clear reasoning, concise final answer.',
  'Correct idea but misses one constraint.',
  'Verbose answer with unsupported claims.',
  'Strong derivation and checks edge cases.',
  'Short answer, partly incomplete.',
  'Good structure but weak final step.',
  'Accurate and follows the requested format.',
  'Refuses when a direct answer was possible.'
];

function mean(values){
  return values.reduce((sum, value)=>sum + value, 0) / values.length;
}

function std(values, center){
  const variance = values.reduce((sum, value)=>sum + Math.pow(value - center, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function clamp(value, min, max){
  return Math.max(min, Math.min(max, value));
}

function setText(id, text){
  const element = document.getElementById(id);
  if(element) element.textContent = text;
}

function makeRewards(groupSize, spread){
  return Array.from({length: groupSize}, (_, i)=>{
    const anchor = 0.52 + ((i / Math.max(1, groupSize - 1)) - .5) * spread;
    const noise = (Math.random() - .5) * spread * .5;
    return clamp(anchor + noise, .04, .98);
  });
}

function render(){
  const groupSize = Number(document.getElementById('groupSize').value);
  const rewardSpread = Number(document.getElementById('rewardSpread').value);
  const clipRange = Number(document.getElementById('clipRange').value);
  const rewards = makeRewards(groupSize, rewardSpread);
  const rewardMean = mean(rewards);
  const rewardStd = std(rewards, rewardMean) || 1;
  const cards = document.getElementById('completionList');

  setText('groupSizeValue', String(groupSize));
  setText('rewardSpreadValue', rewardSpread.toFixed(2));
  setText('clipValue', clipRange.toFixed(2));
  setText('meanReward', rewardMean.toFixed(2));

  const advantages = rewards.map((reward)=>(reward - rewardMean) / rewardStd);
  setText('bestAdvantage', Math.max(...advantages).toFixed(2));

  cards.innerHTML = '';
  rewards.forEach((reward, index)=>{
    const advantage = advantages[index];
    const pressure = clamp(advantage, -clipRange * 5, clipRange * 5);
    const card = document.createElement('article');
    card.className = `completion-card ${advantage >= 0 ? 'good' : 'bad'}`;
    card.innerHTML = `
      <h3>Completion ${index + 1}</h3>
      <p>${sampleTexts[index]}</p>
      <div class="completion-score"><span>reward</span><strong>${reward.toFixed(2)}</strong></div>
      <div class="completion-score"><span>advantage</span><strong>${advantage.toFixed(2)}</strong></div>
      <div class="bar-track"><div class="bar-fill ${advantage >= 0 ? '' : 'rust'}" style="width:${Math.min(100, Math.abs(pressure) * 100)}%"></div></div>
    `;
    cards.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  window.VizArd.renderKatexElements();
  ['groupSize', 'rewardSpread', 'clipRange'].forEach((id)=>{
    document.getElementById(id).addEventListener('input', render);
  });
  document.getElementById('resample').addEventListener('click', render);
  render();
});
