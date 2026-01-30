const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value));

export function predictTomorrowBudget(
  today: number,
  sleepQuality: number,
  restTime: number
): number {
  const normalizedToday = clamp(today);
  const normalizedSleep = clamp(sleepQuality);
  const normalizedRest = clamp(restTime);

  const recovery = normalizedSleep * 0.6 + normalizedRest * 0.4;
  const tomorrow = normalizedToday * 0.4 + recovery * 0.6;

  return clamp(tomorrow);
}
