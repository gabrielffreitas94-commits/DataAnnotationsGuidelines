import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

const STORAGE_KEY_TIMER_SECONDS = 'da_guidelines_timer_seconds';
const STORAGE_KEY_TIMER_RUNNING = 'da_guidelines_timer_running';
const STORAGE_KEY_TIMER_LAST_TS = 'da_guidelines_timer_last_ts';

interface TaskTimerProps {
  resetSignal?: number;
}

export function TaskTimer({ resetSignal }: TaskTimerProps) {
  const { t } = useI18n();

  const [seconds, setSeconds] = useState<number>(() => {
    try {
      const savedSec = Number(localStorage.getItem(STORAGE_KEY_TIMER_SECONDS) || '0');
      const wasRunning = localStorage.getItem(STORAGE_KEY_TIMER_RUNNING) === 'true';
      const lastTs = Number(localStorage.getItem(STORAGE_KEY_TIMER_LAST_TS) || '0');
      if (wasRunning && lastTs > 0) {
        const delta = Math.max(0, Math.floor((Date.now() - lastTs) / 1000));
        return savedSec + delta;
      }
      return isNaN(savedSec) ? 0 : savedSec;
    } catch {
      return 0;
    }
  });

  const [running, setRunning] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_TIMER_RUNNING) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (resetSignal && resetSignal > 0) {
      setRunning(false);
      setSeconds(0);
      try {
        localStorage.setItem(STORAGE_KEY_TIMER_SECONDS, '0');
        localStorage.setItem(STORAGE_KEY_TIMER_RUNNING, 'false');
        localStorage.removeItem(STORAGE_KEY_TIMER_LAST_TS);
      } catch {
        // ignore
      }
    }
  }, [resetSignal]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TIMER_SECONDS, String(seconds));
      localStorage.setItem(STORAGE_KEY_TIMER_RUNNING, String(running));
      if (running) {
        localStorage.setItem(STORAGE_KEY_TIMER_LAST_TS, String(Date.now()));
      } else {
        localStorage.removeItem(STORAGE_KEY_TIMER_LAST_TS);
      }
    } catch {
      // ignore
    }
  }, [seconds, running]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const handleReset = () => {
    setRunning(false);
    setSeconds(0);
  };

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formatted =
    hrs > 0
      ? `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div
      className={`h-8 px-2 rounded-lg border flex items-center gap-1.5 text-xs font-mono transition-colors shrink-0 ${
        running
          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300'
          : 'bg-neutral-50 dark:bg-[#111113] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
      }`}
      title={t('header.timerTooltip')}
    >
      <Timer className={`w-3.5 h-3.5 ${running ? 'text-emerald-600 dark:text-emerald-400 animate-pulse' : 'text-neutral-400 dark:text-neutral-500'}`} />
      <span className="text-[11px] font-semibold tracking-tight min-w-[38px] text-center select-none">
        {formatted}
      </span>
      <button
        type="button"
        onClick={() => setRunning(r => !r)}
        className="p-1 rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        title={running ? t('header.timerPause') : t('header.timerStart')}
      >
        {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
      </button>
      {seconds > 0 && (
        <button
          type="button"
          onClick={handleReset}
          className="p-1 rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
          title={t('header.timerReset')}
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
