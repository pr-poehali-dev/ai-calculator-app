import { useState, useEffect } from 'react';
import { Calculator } from '@/components/Calculator';
import { ThemeSelector } from '@/components/ThemeSelector';
import { HistoryPanel } from '@/components/HistoryPanel';
import { AIAssistant } from '@/components/AIAssistant';
import { GraphVisualizer } from '@/components/GraphVisualizer';
import { FractionCalculator } from '@/components/FractionCalculator';

const Index = () => {
  const [theme, setTheme] = useState('blue');
  const [history, setHistory] = useState<Array<{expression: string, result: string, timestamp: Date}>>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addToHistory = (expression: string, result: string) => {
    setHistory(prev => [{expression, result, timestamp: new Date()}, ...prev].slice(0, 20));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            AI Calculator
          </h1>
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Calculator onCalculate={addToHistory} />
            <AIAssistant onCalculate={addToHistory} />
            <GraphVisualizer />
            <FractionCalculator />
          </div>
          
          <div className="lg:col-span-1">
            <HistoryPanel history={history} onSelectHistory={(expr) => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;