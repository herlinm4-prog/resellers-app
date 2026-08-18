import React, { useState, useEffect } from 'react';
import './ScannerDecisionCard.css';
const ScannerDecisionCard = ({ product }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  useEffect(() => { if (product) analyzeProduct(); }, [product]);
  const analyzeProduct = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://reseller-backend-9exp.onrender.com';
      const response = await fetch(`${apiUrl}/api/analyze-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upc: product.upc, sku: product.sku })
      });
      const data = await response.json();
      setAnalysis(data);
      let score = 0;
      if (data.margin > 30) score += 3;
      if (data.monthlyVolume > 100) score += 2;
      if (data.competitionLevel === 'Low') score += 3;
      setScore(Math.min(score, 10));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  if (loading) return <div style={{padding: '20px', textAlign: 'center'}}>Analizando...</div>;
  if (error) return <div style={{padding: '20px', color: 'red'}}>Error: {error}</div>;
  if (!analysis) return null;
  return (
    <div style={{padding: '20px', background: '#1a1a1a', borderRadius: '16px', color: '#fff', marginBottom: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h2 style={{margin: 0, fontSize: '24px'}}>{analysis.verdict}</h2>
        <div style={{fontSize: '32px', fontWeight: 'bold', color: score > 7 ? '#10b981' : '#f59e0b'}}>{score}/10</div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px'}}>
        <div style={{background: '#333', padding: '12px', borderRadius: '8px'}}>
          <div style={{fontSize: '12px', color: '#999'}}>Margen</div>
          <div style={{fontSize: '18px', fontWeight: 'bold'}}>{analysis.margin}%</div>
        </div>
        <div style={{background: '#333', padding: '12px', borderRadius: '8px'}}>
          <div style={{fontSize: '12px', color: '#999'}}>Volumen</div>
          <div style={{fontSize: '18px', fontWeight: 'bold'}}>{analysis.monthlyVolume}</div>
        </div>
        <div style={{background: '#333', padding: '12px', borderRadius: '8px'}}>
          <div style={{fontSize: '12px', color: '#999'}}>Competencia</div>
          <div style={{fontSize: '18px', fontWeight: 'bold'}}>{analysis.competitionLevel}</div>
        </div>
        <div style={{background: '#333', padding: '12px', borderRadius: '8px'}}>
          <div style={{fontSize: '12px', color: '#999'}}>Precio Promedio</div>
          <div style={{fontSize: '18px', fontWeight: 'bold'}}>${analysis.avgPrice}</div>
        </div>
      </div>
    </div>
  );
};
export default ScannerDecisionCard;
