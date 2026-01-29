import type { AttentionState, FeasibilityResult, FeasibilityStatus, Task } from "../types";

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value));

const statusFromScore = (score: number): FeasibilityStatus => {
  if (score >= 60) {
    return "OK";
  }
  if (score >= 30) {
    return "RISK";
  }
  return "OVERLOAD";
};

export function calculateFeasibilityScore(
  tasks: Task[],
  budget: AttentionState
): FeasibilityResult {
  if (!tasks || tasks.length === 0) {
    return { score: 100, status: "OK" };
  }

  const focusBudget = Math.max(1, clamp(budget.focus_capacity));
  const switchingBudget = Math.max(1, clamp(100 - budget.switching_fatigue));
  const emotionalBudget = Math.max(1, clamp(budget.recovery_level));

  let focusDemand = 0;
  let switchingDemand = 0;
  let emotionalDemand = 0;

  for (const task of tasks) {
    focusDemand += clamp(task.attention_demand.focus);
    switchingDemand += clamp(task.attention_demand.switching);
    emotionalDemand += clamp(task.attention_demand.emotional);
  }

  const focusRatio = focusDemand / focusBudget;
  const switchingRatio = switchingDemand / switchingBudget;
  const emotionalRatio = emotionalDemand / emotionalBudget;

  const averageRatio = (focusRatio + switchingRatio + emotionalRatio) / 3;
  const score = clamp((1 - averageRatio) * 100);

  return { score, status: statusFromScore(score) };
}
