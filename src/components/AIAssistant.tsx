import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { evaluate } from 'mathjs';

interface AIAssistantProps {
  onCalculate: (expression: string, result: string) => void;
}

export const AIAssistant = ({ onCalculate }: AIAssistantProps) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processNaturalLanguage = (text: string): string => {
    let processed = text.toLowerCase()
      .replace(/плюс|сложить/g, '+')
      .replace(/минус|вычесть/g, '-')
      .replace(/умножить на|умножить/g, '*')
      .replace(/разделить на|делить/g, '/')
      .replace(/в степени|степень/g, '^')
      .replace(/корень из/g, 'sqrt(') 
      .replace(/синус/g, 'sin(')
      .replace(/косинус/g, 'cos(')
      .replace(/тангенс/g, 'tan(')
      .replace(/пи/g, 'pi');
    
    const openParens = (processed.match(/\(/g) || []).length;
    const closeParens = (processed.match(/\)/g) || []).length;
    processed += ')'.repeat(openParens - closeParens);
    
    return processed;
  };

  const handleCalculate = () => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const processed = processNaturalLanguage(input);
        const calcResult = evaluate(processed);
        const resultStr = calcResult.toString();
        setResult(resultStr);
        onCalculate(input, resultStr);
      } catch (error) {
        setResult('Не удалось вычислить выражение');
      }
      setIsProcessing(false);
    }, 500);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Ваш браузер не поддерживает голосовой ввод');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Card className="p-6 backdrop-blur-xl bg-card/80 border-2 border-primary/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Icon name="Sparkles" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI Помощник</h2>
          <p className="text-sm text-muted-foreground">Голосовой ввод и умные вычисления</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Например: корень из 16 плюс синус 30 умножить на 2"
            className="min-h-[120px] text-lg rounded-2xl pr-16 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCalculate();
              }
            }}
          />
          <Button
            size="icon"
            variant={isListening ? 'default' : 'outline'}
            onClick={startVoiceInput}
            className={`absolute bottom-3 right-3 rounded-full h-12 w-12 ${
              isListening ? 'animate-pulse' : ''
            }`}
          >
            <Icon name="Mic" size={20} />
          </Button>
        </div>

        {isListening && (
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <Icon name="Radio" size={20} />
            <span>Слушаю...</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleCalculate}
            disabled={!input.trim() || isProcessing}
            className="flex-1 h-12 rounded-2xl text-lg hover:scale-105 transition-transform"
          >
            {isProcessing ? (
              <>
                <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                Вычисляю...
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={20} className="mr-2" />
                Вычислить
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => { setInput(''); setResult(''); }}
            className="h-12 rounded-2xl hover:scale-105 transition-transform"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {result && (
          <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20">
            <div className="flex items-start gap-3">
              <Badge variant="default" className="rounded-full">Результат</Badge>
              <div className="flex-1">
                <p className="text-3xl font-bold text-primary break-all">{result}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">Примеры команд:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'корень из 144',
              'синус 45 плюс косинус 45',
              '15 в степени 3',
              '2 плюс 2 умножить на 2'
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setInput(example)}
                className="text-left p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all text-sm hover:scale-[1.02]"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
