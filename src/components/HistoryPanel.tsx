import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectHistory: (expression: string) => void;
}

export const HistoryPanel = ({ history, onSelectHistory }: HistoryPanelProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="p-6 backdrop-blur-xl bg-card/80 border-2 border-primary/10 shadow-2xl h-[calc(100vh-12rem)] sticky top-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="History" size={24} className="text-primary" />
        <h2 className="text-2xl font-bold">История</h2>
      </div>
      
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)] text-muted-foreground">
          <Icon name="Calculator" size={48} className="mb-4 opacity-50" />
          <p className="text-center">Вычисления будут<br />отображаться здесь</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="space-y-3">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => onSelectHistory(item.expression)}
                className="w-full text-left p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all hover:scale-[1.02] border border-transparent hover:border-primary/20"
              >
                <div className="text-sm text-muted-foreground mb-1">{formatTime(item.timestamp)}</div>
                <div className="text-lg font-light text-foreground mb-1 break-all">{item.expression}</div>
                <div className="text-xl font-medium text-primary break-all">= {item.result}</div>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
