import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Icon from '@/components/ui/icon';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const themes = [
    { id: 'blue', name: 'Синий', color: 'bg-[#0EA5E9]' },
    { id: 'green', name: 'Зелёный', color: 'bg-[#10B981]' },
    { id: 'red', name: 'Красный', color: 'bg-[#EF4444]' },
    { id: 'purple', name: 'Фиолетовый', color: 'bg-[#8B5CF6]' },
    { id: 'dark', name: 'Тёмный', color: 'bg-[#1A1F2C]' }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:scale-110 transition-transform">
          <Icon name="Palette" size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4 rounded-2xl backdrop-blur-xl bg-card/95 border-2 border-primary/10">
        <div className="space-y-2">
          <p className="text-sm font-medium mb-3">Выберите тему</p>
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-accent ${
                currentTheme === theme.id ? 'bg-primary/10 border-2 border-primary' : 'border-2 border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-full ${theme.color} shadow-lg`} />
              <span className="font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
