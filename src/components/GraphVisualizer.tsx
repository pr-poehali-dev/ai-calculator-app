import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { evaluate } from 'mathjs';
import Icon from '@/components/ui/icon';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const GraphVisualizer = () => {
  const [equation, setEquation] = useState('x^2');
  const [data, setData] = useState<Array<{x: number, y: number}>>([]);
  const [latexFormula, setLatexFormula] = useState('f(x) = x^2');

  const convertToLatex = (expr: string): string => {
    return expr
      .replace(/\*/g, '\\cdot ')
      .replace(/\^/g, '^')
      .replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}')
      .replace(/sin\((.*?)\)/g, '\\sin($1)')
      .replace(/cos\((.*?)\)/g, '\\cos($1)')
      .replace(/tan\((.*?)\)/g, '\\tan($1)')
      .replace(/log\((.*?)\)/g, '\\log($1)')
      .replace(/pi/g, '\\pi')
      .replace(/\//g, '\\frac');
  };

  const generateGraph = () => {
    try {
      const points: Array<{x: number, y: number}> = [];
      for (let x = -10; x <= 10; x += 0.2) {
        try {
          const y = evaluate(equation.replace(/x/g, `(${x})`));
          if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
            points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
          }
        } catch {
          continue;
        }
      }
      setData(points);
      setLatexFormula(`f(x) = ${convertToLatex(equation)}`);
    } catch (error) {
      alert('Ошибка в формуле');
    }
  };

  const examples = [
    { label: 'Парабола', eq: 'x^2', latex: 'x^2' },
    { label: 'Синус', eq: 'sin(x)', latex: '\\sin(x)' },
    { label: 'Кубическая', eq: 'x^3 - 2*x', latex: 'x^3 - 2x' },
    { label: 'Экспонента', eq: 'e^x', latex: 'e^x' }
  ];

  return (
    <Card className="p-6 backdrop-blur-xl bg-card/80 border-2 border-primary/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Icon name="TrendingUp" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">График функции</h2>
          <p className="text-sm text-muted-foreground">Визуализация математических функций</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2">
          <Input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="Введите функцию, например: x^2 + 2*x - 1"
            className="flex-1 h-12 rounded-2xl text-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                generateGraph();
              }
            }}
          />
          <Button 
            onClick={generateGraph}
            className="h-12 rounded-2xl hover:scale-105 transition-transform"
          >
            <Icon name="Play" size={20} />
          </Button>
        </div>

        {data.length > 0 && (
          <div className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-2xl text-center">
              <BlockMath math={latexFormula} />
            </div>

            <div className="bg-secondary/20 rounded-2xl p-4 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="x" 
                    label={{ value: 'x', position: 'insideBottomRight', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'y', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">Примеры функций:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setEquation(ex.eq);
                  setTimeout(generateGraph, 100);
                }}
                className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all hover:scale-[1.02] text-center"
              >
                <div className="font-medium mb-1">{ex.label}</div>
                <div className="text-xs">
                  <InlineMath math={ex.latex} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
