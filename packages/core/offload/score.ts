import type { Task, OffloadDecision, ExecutionTarget } from "../types";

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value));

const OFFLOAD_THRESHOLD = 40;

export function calculateOffloadDecisions(
  tasks: Task[],
  remainingBudget: number
): OffloadDecision[] {
  const budget = Math.max(0, remainingBudget);

  return tasks.map((task) => {
    const focus = clamp(task.attention_demand.focus);
    const switching = clamp(task.attention_demand.switching);
    const emotional = clamp(task.attention_demand.emotional);

    const weightedDemand =
      focus * 0.4 +
      switching * 0.3 +
      emotional * 0.3;

    const load =
      budget === 0
        ? Number.POSITIVE_INFINITY
        : weightedDemand / budget;

    const automationAffinity = clamp(task.automation_affinity, 0, 1);
    const riskMultiplier = 1 - clamp(task.risk, 0, 1);

    const offloadScore = clamp(
      load * automationAffinity * riskMultiplier * 100
    );

    const executeBy: ExecutionTarget =
      offloadScore >= OFFLOAD_THRESHOLD
        ? "AGENT"
        : "HUMAN";

    return {
      taskId: task.id,
      executeBy,
      offloadScore,
    };
  });
}
