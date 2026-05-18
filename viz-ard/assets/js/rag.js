const questions = {
  gaussian: 'How does Gaussian regression represent uncertainty?',
  poisson: 'Why does Poisson regression use a log link?',
  attention: 'What does attention retrieve from tokens?',
  grpo: 'What does GRPO compare inside a group?',
  mamba: 'How is a state-space model different from attention?',
  rag: 'How does RAG reduce hallucination risk?'
};

const documents = [
  {
    title: 'Gaussian regression',
    text: 'Gaussian regression models a continuous target as a mean function plus normally distributed residual noise. The variance controls uncertainty around individual observations.'
  },
  {
    title: 'Least squares likelihood',
    text: 'With Gaussian residuals, minimizing squared error points in the same direction as maximizing the likelihood of the observed continuous targets.'
  },
  {
    title: 'Poisson log link',
    text: 'Poisson regression models non-negative count outcomes by predicting log lambda as a linear function, then exponentiating to keep the expected count positive.'
  },
  {
    title: 'Rate ratios',
    text: 'A coefficient in Poisson regression becomes a multiplicative rate ratio after exponentiation. One unit of x multiplies the expected count by exp beta.'
  },
  {
    title: 'GRPO group baseline',
    text: 'GRPO samples multiple completions for the same prompt, scores them, and computes advantages by comparing each reward to the mean and spread of the group.'
  },
  {
    title: 'GRPO update control',
    text: 'A clipped objective and reference-policy penalty keep policy updates controlled while promoting completions with positive group-relative advantage.'
  },
  {
    title: 'RAG grounding',
    text: 'Retrieval augmented generation retrieves relevant passages before answering, so the model can ground the response in external context instead of relying only on parametric memory.'
  },
  {
    title: 'Attention routing',
    text: 'Attention forms query, key, and value vectors. Query-key similarity decides which token values are read into the current token representation.'
  },
  {
    title: 'State-space scan',
    text: 'A state-space sequence model carries a compact hidden state forward through the sequence instead of comparing every token pair with attention.'
  },
  {
    title: 'Mamba selection',
    text: 'Mamba-style models make state-space updates depend on the current token, which lets the scan selectively remember or forget information.'
  },
  {
    title: 'RAG failure modes',
    text: 'RAG can still fail when retrieval misses the needed passage, ranks weak chunks highly, or passes stale information into the model context.'
  }
];

const stopwords = new Set(['the','a','an','as','by','to','of','and','or','in','on','for','does','what','how','why','is','it']);

function tokenize(text){
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token)=>token && !stopwords.has(token));
}

function scoreDocument(query, documentText){
  const queryTokens = tokenize(query);
  const docTokens = new Set(tokenize(documentText));
  const matches = queryTokens.filter((token)=>docTokens.has(token)).length;
  return matches / Math.max(1, queryTokens.length);
}

function setText(id, text){
  const element = document.getElementById(id);
  if(element) element.textContent = text;
}

function renderDocs(results){
  const docs = document.getElementById('docs');
  docs.innerHTML = '';

  if(results.length === 0){
    const empty = document.createElement('div');
    empty.className = 'doc';
    empty.innerHTML = '<strong>No passage passed the threshold</strong><p>Lower the minimum score or ask a question represented in the corpus.</p>';
    docs.appendChild(empty);
    return;
  }

  results.forEach((result, index)=>{
    const item = document.createElement('article');
    item.className = 'doc';
    item.innerHTML = `
      <strong><span>${index + 1}. ${result.title}</span><span>${result.score.toFixed(2)}</span></strong>
      <p>${result.text}</p>
    `;
    docs.appendChild(item);
  });
}

function makeAnswer(queryKey, results){
  if(results.length === 0){
    return 'The retriever did not return enough evidence, so the system should abstain or ask for better context.';
  }

  const cited = results.slice(0, 2).map((result)=>result.title).join(' and ');
  if(queryKey === 'gaussian'){
    return `Gaussian regression represents uncertainty by modeling residual noise around the conditional mean. The relevant retrieved passages are ${cited}.`;
  }
  if(queryKey === 'poisson'){
    return `Poisson regression uses a log link so the linear predictor becomes a positive expected count after exponentiation. The relevant retrieved passages are ${cited}.`;
  }
  if(queryKey === 'attention'){
    return `Attention retrieves value information from tokens whose keys match the current query. The relevant retrieved passages are ${cited}.`;
  }
  if(queryKey === 'grpo'){
    return `GRPO compares completions from the same prompt by normalizing rewards inside the group, then promotes relative winners under a controlled update. The relevant retrieved passages are ${cited}.`;
  }
  if(queryKey === 'mamba'){
    return `A state-space model scans a compact hidden state through the sequence, while attention compares token pairs directly. The relevant retrieved passages are ${cited}.`;
  }
  return `RAG reduces hallucination risk by retrieving evidence before generation, but retrieval quality still determines whether the answer is grounded. The relevant retrieved passages are ${cited}.`;
}

function render(){
  const queryKey = document.getElementById('query').value;
  const topK = Number(document.getElementById('topK').value);
  const threshold = Number(document.getElementById('threshold').value);
  const query = questions[queryKey];

  setText('topKValue', String(topK));
  setText('thresholdValue', threshold.toFixed(2));
  setText('queryText', query);

  const ranked = documents
    .map((document)=>({...document, score: scoreDocument(query, `${document.title} ${document.text}`)}))
    .sort((a, b)=>b.score - a.score)
    .filter((document)=>document.score >= threshold)
    .slice(0, topK);

  renderDocs(ranked);
  setText('retrievalSummary', `${ranked.length} passage${ranked.length === 1 ? '' : 's'} above threshold`);
  setText('groundingSummary', ranked.length > 0 ? 'Answer uses retrieved context' : 'No grounded answer');
  setText('answer', makeAnswer(queryKey, ranked));
}

document.addEventListener('DOMContentLoaded', ()=>{
  window.VizArd.renderKatexElements();
  ['query', 'topK', 'threshold'].forEach((id)=>{
    document.getElementById(id).addEventListener('input', render);
    document.getElementById(id).addEventListener('change', render);
  });
  render();
});
