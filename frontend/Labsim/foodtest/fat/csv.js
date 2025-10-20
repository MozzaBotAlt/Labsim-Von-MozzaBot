// Simple result logger + CSV export for judge/student
// Add <script src="/experiments/resultCapture.js"></script> on pages that need it

document.addEventListener('DOMContentLoaded', () => {
  window.results = window.results || [];

  const addResult = (r) => {
    window.results.push(r);
    console.log('result added', r);
  };

  window.exportResultsCSV = () => {
    if (!window.results.length) return alert('No results to export');
    const keys = Object.keys(window.results[0]);
    const csv = [
      keys.join(','),
      ...window.results.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '/result/fat_test.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // expose helper for pages:
  window.labsimAddObservation = (label, value) => addResult({ timestamp: new Date().toISOString(), label, value });
});