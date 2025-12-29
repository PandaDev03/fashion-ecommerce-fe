type ToastType = 'success' | 'info' | 'warning' | 'error';

interface CooldownConfig {
  success: number;
  info: number;
  warning: number;
  error: number;
}

class NotificationEmitter {
  private listeners: ((type: ToastType, message: string) => void)[] = [];
  private lastToastTimes: Map<string, number> = new Map();

  private cooldownConfig: CooldownConfig = {
    success: 2000,
    info: 2000,
    warning: 1500,
    error: 1000,
  };

  subscribe(callback: (type: ToastType, message: string) => void) {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  emit(type: ToastType, message: string): boolean {
    const key = `${type}-${message}`;
    const now = Date.now();
    const cooldown = this.cooldownConfig[type];
    const lastTime = this.lastToastTimes.get(key) || 0;

    if (now - lastTime < cooldown) return false;

    this.lastToastTimes.set(key, now);
    this.listeners.forEach((listener) => listener(type, message));

    return true;
  }

  forceEmit(type: ToastType, message: string): void {
    this.listeners.forEach((listener) => listener(type, message));
  }

  setCooldown(type: ToastType, milliseconds: number): void {
    this.cooldownConfig[type] = milliseconds;
  }

  setCooldowns(config: Partial<CooldownConfig>): void {
    this.cooldownConfig = { ...this.cooldownConfig, ...config };
  }

  getCooldowns(): CooldownConfig {
    return { ...this.cooldownConfig };
  }

  clearCooldown(type: ToastType, message: string): void {
    const key = `${type}-${message}`;
    this.lastToastTimes.delete(key);
  }

  clearAllCooldowns(): void {
    this.lastToastTimes.clear();
  }

  getRemainingCooldown(type: ToastType, message: string): number {
    const key = `${type}-${message}`;
    const lastTime = this.lastToastTimes.get(key) || 0;
    const now = Date.now();
    const cooldown = this.cooldownConfig[type];
    const elapsed = now - lastTime;
    const remaining = Math.max(0, cooldown - elapsed);
    return remaining;
  }
}

export const notificationEmitter = new NotificationEmitter();
