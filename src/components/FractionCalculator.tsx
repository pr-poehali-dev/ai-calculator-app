import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { BlockMath } from 'react-katex';
import { fraction, gcd as mathGcd } from 'mathjs';

export const FractionCalculator = () => {
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('2');
  const [num2, setNum2] = useState('1');
  const [den2, setDen2] = useState('3');
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState<{num: number, den: number} | null>(null);

  const simplifyFraction = (numerator: number, denominator: number) => {
    const gcdValue = mathGcd(Math.abs(numerator), Math.abs(denominator));
    return {
      num: numerator / gcdValue,
      den: denominator / gcdValue
    };
  };

  const calculate = () => {
    try {
      const a = fraction(parseInt(num1), parseInt(den1));
      const b = fraction(parseInt(num2), parseInt(den2));
      
      let res;
      switch(operation) {
        case '+':
          res = a.add(b);
          break;
        case '-':
          res = a.sub(b);
          break;
        case '*':
          res = a.mul(b);
          break;
        case '/':
          res = a.div(b);
          break;
        default:
          return;
      }
      
      setResult(simplifyFraction(res.n, res.d));
    } catch (error) {
      alert('Ошибка в вычислениях');
    }
  };

  const getFractionLatex = (num: string, den: string) => {
    return `\\frac{${num}}{${den}}`;
  };

  const getOperationLatex = () => {
    const ops: Record<string, string> = {
      '+': '+',
      '-': '-',
      '*': '\\times',
      '/': '\\div'
    };
    return ops[operation] || '+';
  };

  return (
    <Card className="p-6 backdrop-blur-xl bg-card/80 border-2 border-primary/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Icon name="Divide" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Калькулятор дробей</h2>
          <p className="text-sm text-muted-foreground">Операции с обыкновенными дробями</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Числитель</label>
            <Input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="h-12 rounded-2xl text-center text-lg"
            />
            <div className="h-[2px] bg-primary rounded-full" />
            <label className="text-sm text-muted-foreground">Знаменатель</label>
            <Input
              type="number"
              value={den1}
              onChange={(e) => setDen1(e.target.value)}
              className="h-12 rounded-2xl text-center text-lg"
            />
          </div>

          <div className="pb-8">
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger className="w-16 h-16 rounded-2xl text-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="+" className="text-2xl">+</SelectItem>
                <SelectItem value="-" className="text-2xl">−</SelectItem>
                <SelectItem value="*" className="text-2xl">×</SelectItem>
                <SelectItem value="/" className="text-2xl">÷</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Числитель</label>
            <Input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="h-12 rounded-2xl text-center text-lg"
            />
            <div className="h-[2px] bg-primary rounded-full" />
            <label className="text-sm text-muted-foreground">Знаменатель</label>
            <Input
              type="number"
              value={den2}
              onChange={(e) => setDen2(e.target.value)}
              className="h-12 rounded-2xl text-center text-lg"
            />
          </div>

          <div className="pb-8">
            <div className="text-4xl font-light">=</div>
          </div>

          {result && (
            <div className="space-y-2">
              <div className="h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {result.num}
              </div>
              <div className="h-[2px] bg-primary rounded-full" />
              <div className="h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {result.den}
              </div>
            </div>
          )}
        </div>

        <Button 
          onClick={calculate}
          className="w-full h-14 rounded-2xl text-lg hover:scale-[1.02] transition-transform"
        >
          <Icon name="Equal" size={20} className="mr-2" />
          Вычислить
        </Button>

        {result && (
          <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20">
            <BlockMath 
              math={`${getFractionLatex(num1, den1)} ${getOperationLatex()} ${getFractionLatex(num2, den2)} = ${getFractionLatex(result.num.toString(), result.den.toString())}`}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setNum1('1'); setDen1('2');
              setNum2('1'); setDen2('4');
              setOperation('+');
            }}
            className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all"
          >
            <BlockMath math="\frac{1}{2} + \frac{1}{4}" />
          </button>
          <button
            onClick={() => {
              setNum1('3'); setDen1('4');
              setNum2('2'); setDen2('3');
              setOperation('*');
            }}
            className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all"
          >
            <BlockMath math="\frac{3}{4} \times \frac{2}{3}" />
          </button>
        </div>
      </div>
    </Card>
  );
};
