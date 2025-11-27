import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { formatPrice } from '../utils/helpers';

export default function PriceHistory({ data, lang, translations }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const labels = [];
    const arabicaArr = [];
    const robustaArr = [];
    const arecanutArr = [];

    data.forEach(d => {
      labels.push(d.date);
      arabicaArr.push(Number(d.arabica));
      robustaArr.push(Number(d.robusta));
      arecanutArr.push(d.arecanut === '—' ? null : Number(d.arecanut));
    });

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Arabica',
            data: arabicaArr,
            borderColor: '#6b4226',
            backgroundColor: 'rgba(107,66,38,0.2)',
            tension: 0.3
          },
          {
            label: 'Robusta',
            data: robustaArr,
            borderColor: '#557a46',
            backgroundColor: 'rgba(85,122,70,0.2)',
            tension: 0.3
          },
          {
            label: 'Arecanut',
            data: arecanutArr,
            borderColor: '#d4af37',
            backgroundColor: 'rgba(212,175,55,0.2)',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      <h2>{translations[lang].historyTitle}</h2>
      <table>
        <thead>
          <tr>
            <th>{translations[lang].date}</th>
            <th>Arabica (₹/kg)</th>
            <th>Robusta (₹/kg)</th>
            <th>Arecanut (₹/kg)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.date}</td>
              <td>{formatPrice(row.arabica)}</td>
              <td>{formatPrice(row.robusta)}</td>
              <td>{formatPrice(row.arecanut)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <canvas ref={chartRef} height="150"></canvas>
    </>
  );
}
