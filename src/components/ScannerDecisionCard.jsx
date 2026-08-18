import React, { useState, useEffect } from 'react';
import './ScannerDecisionCard.css';

const ScannerDecisionCard = ({ product }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (product) {
      analyzeProduct();
    }
  }, [product]);

  const analyzeProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'https://reseller-backend-9exp.onrender.com'}/api/analyze-complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ upc: product.upc, sku: product.sku })
        }
      );
      const data = await response.json();
      setAnalysis(data);
      calculateScore(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (data) => {
    let score = 0;
    if (data.margin > 30) score += 3;
    else if (data.margin > 20) score += 2;
    else if (data.margin > 10) score += 1;
    
    if (data.monthlyVolume > 100) score += 2;
    else if (data.monthlyVolume > 50) score += 1;
    
    if (data.competitionLevel === 'Low') score += 3;
    else if (data.competitionLevel === 'Medium') score += 1;
    
    if (data.daysToSell < 30) score += 2;
    
    setScore(Math.min(score, 10));
  };

  if (loading) return <div>Analizando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analysis) return null;

  return (
    <div className="scanner-decision-card">
      <div className="score-section">
        <h3>Score: {score}/10</h3>
      </div>
      <div className="details">
        <p>Margen: {analysis.margin}%</p>
        <p>Volumen: {analysis.monthlyVolume} unidades/mes</p>
        <p>Competencia: {analysis.competitionLevel}</p>
      </div>
    </div>
  );
};

export default ScannerDecisionCard;
