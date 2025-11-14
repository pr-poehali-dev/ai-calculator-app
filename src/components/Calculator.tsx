import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { evaluate } from 'mathjs';

interface CalculatorProps {
  onCalculate: (expression: string, result: string) => void;
}

export const Calculator = ({ onCalculate }: CalculatorProps) => {
  const [display, setDisplay] = useState('0');
  const [mode, setMode] = useState<'basic' | 'scientific'>('basic');

  const handleClick = (value: string) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const calculate = () => {
    try {
      const result = evaluate(display);
      const resultStr = result.toString();
      onCalculate(display, resultStr);
      setDisplay(resultStr);
    } catch (error) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1500);
    }
  };

  const clear = () => setDisplay('0');
  const backspace = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const basicButtons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ];

  const scientificButtons = [
    ['sin(', 'cos(', 'tan(', '^'],
    ['sqrt(', 'log(', 'ln(', 'π'],
    ['(', ')', 'e', '%']
  ];

  return (
    <Card className="p-6 backdrop-blur-xl bg-card/80 border-2 border-primary/10 shadow-2xl">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'basic' | 'scientific')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="basic" className="rounded-full">Базовый</TabsTrigger>
          <TabsTrigger value="scientific" className="rounded-full">Инженерный</TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <div className="bg-secondary/30 backdrop-blur rounded-2xl p-6 min-h-[100px] flex items-center justify-end">
            <span className="text-4xl md:text-5xl font-light text-foreground break-all">{display}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            onClick={clear}
            className="flex-1 h-14 rounded-2xl text-lg hover:scale-105 transition-transform"
          >
            <Icon name="RotateCcw" size={20} />
          </Button>
          <Button 
            variant="outline" 
            onClick={backspace}
            className="flex-1 h-14 rounded-2xl text-lg hover:scale-105 transition-transform"
          >
            <Icon name="Delete" size={20} />
          </Button>
        </div>

        <TabsContent value="basic" className="mt-0">
          <div className="grid grid-cols-4 gap-3">
            {basicButtons.flat().map((btn) => (
              <Button
                key={btn}
                variant={btn === '=' ? 'default' : 'secondary'}
                onClick={() => btn === '=' ? calculate() : handleClick(btn)}
                className={`h-16 text-2xl font-light rounded-2xl hover:scale-105 transition-transform ${
                  btn === '=' ? 'col-span-1 bg-primary text-primary-foreground' : ''
                } ${['+', '-', '*', '/'].includes(btn) ? 'bg-accent' : ''}`}
              >
                {btn}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scientific" className="mt-0 space-y-3">
          <div className="grid grid-cols-4 gap-3 mb-3">
            {scientificButtons.flat().map((btn) => (
              <Button
                key={btn}
                variant="secondary"
                onClick={() => handleClick(btn === 'π' ? 'pi' : btn === 'e' ? 'e' : btn)}
                className="h-14 text-lg font-light rounded-2xl hover:scale-105 transition-transform bg-accent"
              >
                {btn}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {basicButtons.flat().map((btn) => (
              <Button
                key={btn}
                variant={btn === '=' ? 'default' : 'secondary'}
                onClick={() => btn === '=' ? calculate() : handleClick(btn)}
                className={`h-16 text-2xl font-light rounded-2xl hover:scale-105 transition-transform ${
                  btn === '=' ? 'bg-primary text-primary-foreground' : ''
                } ${['+', '-', '*', '/'].includes(btn) ? 'bg-accent' : ''}`}
              >
                {btn}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
