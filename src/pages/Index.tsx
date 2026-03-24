import { useState, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import Icon from "@/components/ui/icon";

interface ModuleState {
  enabled: boolean;
  value: number;
}

interface AppState {
  latency: ModuleState;
  packetLoss: ModuleState;
  bandwidth: ModuleState;
}

const MODULES = [
  {
    id: "latency" as const,
    label: "ЗАДЕРЖКА",
    sublabel: "Latency / Lag",
    icon: "Clock",
    unit: "мс",
    min: 0,
    max: 2000,
    step: 10,
    defaultValue: 100,
    description: "Искусственная задержка для всех пакетов",
    marks: ["0", "500", "1000", "2000"],
  },
  {
    id: "packetLoss" as const,
    label: "ПОТЕРЯ ПАКЕТОВ",
    sublabel: "Packet Loss",
    icon: "Shuffle",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 10,
    description: "Случайный сброс входящих пакетов",
    marks: ["0%", "25%", "50%", "100%"],
  },
  {
    id: "bandwidth" as const,
    label: "ПРОПУСКНАЯ СПОСОБНОСТЬ",
    sublabel: "Bandwidth Throttle",
    icon: "Gauge",
    unit: " Кб/с",
    min: 10,
    max: 10000,
    step: 10,
    defaultValue: 1000,
    description: "Максимальная скорость передачи данных",
    marks: ["10", "2500", "5000", "10000"],
  },
];

function formatValue(value: number, unit: string): string {
  if (unit === " Кб/с" && value >= 1000) {
    return `${(value / 1000).toFixed(1)} Мб/с`;
  }
  return `${value}${unit}`;
}

export default function Index() {
  const [state, setState] = useState<AppState>({
    latency: { enabled: false, value: 100 },
    packetLoss: { enabled: false, value: 10 },
    bandwidth: { enabled: false, value: 1000 },
  });

  const [isRunning, setIsRunning] = useState(false);

  const toggleModule = useCallback((id: keyof AppState) => {
    setState((prev) => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id].enabled },
    }));
  }, []);

  const updateValue = useCallback((id: keyof AppState, value: number) => {
    setState((prev) => ({
      ...prev,
      [id]: { ...prev[id], value },
    }));
  }, []);

  const activeCount = Object.values(state).filter((m) => m.enabled).length;

  const handleMainToggle = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-mono flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1e1e1e] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-xs tracking-[0.3em] text-[#666] uppercase">
            NetSim
          </span>
          <span className="text-xs text-[#333] ml-2">v1.0</span>
        </div>
        <div className="flex items-center gap-6">
          {activeCount > 0 && (
            <span className="text-xs text-[#555] tracking-widest">
              {activeCount}{" "}
              {activeCount === 1
                ? "модуль активен"
                : activeCount < 5
                  ? "модуля активно"
                  : "модулей активно"}
            </span>
          )}
          <div className="text-xs text-[#333] tracking-widest">
            {new Date().toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-8 py-10 max-w-3xl mx-auto w-full">
        {/* Status bar */}
        <div
          className={`mb-10 rounded-sm border px-5 py-4 flex items-center justify-between transition-all duration-300 ${
            isRunning
              ? "border-[#00ff88]/30 bg-[#00ff88]/5"
              : "border-[#1e1e1e] bg-[#111]"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-1.5 h-8 rounded-full transition-colors duration-300 ${isRunning ? "bg-[#00ff88]" : "bg-[#2a2a2a]"}`}
            />
            <div>
              <div className="text-sm font-semibold tracking-wider text-white">
                {isRunning ? "СИМУЛЯЦИЯ АКТИВНА" : "СИМУЛЯЦИЯ ОСТАНОВЛЕНА"}
              </div>
              <div className="text-xs text-[#555] mt-0.5 tracking-wide">
                {isRunning
                  ? "Сетевые условия применяются к трафику"
                  : "Нажмите запуск для применения настроек"}
              </div>
            </div>
          </div>
          <button
            onClick={handleMainToggle}
            className={`px-6 py-2.5 rounded-sm text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 ${
              isRunning
                ? "bg-[#1e1e1e] text-[#ff4444] border border-[#ff4444]/30 hover:bg-[#ff4444]/10"
                : "bg-[#00ff88] text-black hover:bg-[#00dd77]"
            }`}
          >
            {isRunning ? "Стоп" : "Запуск"}
          </button>
        </div>

        {/* Modules */}
        <div className="space-y-3">
          {MODULES.map((mod) => {
            const moduleState = state[mod.id];
            const isEnabled = moduleState.enabled;
            return (
              <div
                key={mod.id}
                className={`border rounded-sm transition-all duration-200 ${
                  isEnabled
                    ? "border-[#2a2a2a] bg-[#111]"
                    : "border-[#181818] bg-[#0f0f0f]"
                }`}
              >
                {/* Module header */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`transition-colors duration-200 ${isEnabled ? "text-[#00ff88]" : "text-[#333]"}`}
                    >
                      <Icon name={mod.icon} size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold tracking-[0.25em] transition-colors duration-200 ${isEnabled ? "text-white" : "text-[#444]"}`}
                        >
                          {mod.label}
                        </span>
                        <span className="text-[10px] text-[#333] tracking-wider">
                          {mod.sublabel}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#444] mt-0.5 tracking-wide">
                        {mod.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div
                      className={`text-lg font-bold tabular-nums transition-colors duration-200 min-w-[90px] text-right ${
                        isEnabled ? "text-[#00ff88]" : "text-[#2a2a2a]"
                      }`}
                    >
                      {formatValue(moduleState.value, mod.unit)}
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => toggleModule(mod.id)}
                      className="data-[state=checked]:bg-[#00ff88]"
                    />
                  </div>
                </div>

                {/* Slider */}
                <div
                  className={`px-6 pb-5 transition-all duration-200 ${isEnabled ? "opacity-100" : "opacity-30"}`}
                >
                  <Slider
                    value={[moduleState.value]}
                    onValueChange={([v]) => updateValue(mod.id, v)}
                    min={mod.min}
                    max={mod.max}
                    step={mod.step}
                    disabled={!isEnabled}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    {mod.marks.map((mark) => (
                      <span
                        key={mark}
                        className="text-[10px] text-[#333] tracking-wider"
                      >
                        {mark}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active config summary */}
        {isRunning && activeCount > 0 && (
          <div className="mt-6 border border-[#1e1e1e] rounded-sm px-6 py-4 bg-[#0a0a0a]">
            <div className="text-[10px] text-[#444] tracking-[0.3em] uppercase mb-3">
              Активная конфигурация
            </div>
            <div className="space-y-1.5">
              {MODULES.filter((m) => state[m.id].enabled).map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <span className="text-xs text-[#555] tracking-wider">
                    {m.sublabel}
                  </span>
                  <span className="text-xs text-[#00ff88] font-bold">
                    {formatValue(state[m.id].value, m.unit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] px-8 py-4 flex items-center justify-between">
        <span className="text-[10px] text-[#2a2a2a] tracking-[0.3em] uppercase">
          Network Simulator
        </span>
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isRunning && activeCount > 0 ? "bg-[#00ff88]" : "bg-[#2a2a2a]"}`}
          />
          <span className="text-[10px] text-[#2a2a2a] tracking-widest">
            {isRunning && activeCount > 0 ? "RUNNING" : "IDLE"}
          </span>
        </div>
      </footer>
    </div>
  );
}
