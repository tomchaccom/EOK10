import type { AttentionAction, AttentionActionType, AttentionState } from "../types";

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value));

type Impact = { focus: number; switching: number; recovery: number };

const ACTION_IMPACT: Record<AttentionActionType, Impact> = {
  study: { focus: -14, switching: 10, recovery: -8 },
  sns: { focus: -8, switching: 14, recovery: -6 },
  meeting: { focus: -12, switching: 12, recovery: -10 },
  move: { focus: -4, switching: 2, recovery: 6 },
  rest: { focus: 6, switching: -10, recovery: 14 },
};

const normalizeState = (state: AttentionState): AttentionState => ({
  focus_capacity: clamp(state.focus_capacity),
  switching_fatigue: clamp(state.switching_fatigue),
  recovery_level: clamp(state.recovery_level),
});

const applyImpact = (state: AttentionState, impact: Impact): AttentionState => {
  const recoveryBuffer = 1 - state.recovery_level / 100;
  const fatigueBuffer = state.switching_fatigue / 100;
  const focusBuffer = 1 - state.focus_capacity / 100;

  const focusStress = 1 + fatigueBuffer * 0.35 + recoveryBuffer * 0.25;
  const focusRelief = 1 + focusBuffer * 0.3;
  const switchingStress = 1 + recoveryBuffer * 0.4;
  const switchingRelief = 1 + fatigueBuffer * 0.2;
  const recoveryStress = 1 + focusBuffer * 0.25 + fatigueBuffer * 0.2;
  const recoveryRelief = 1 + recoveryBuffer * 0.35;

  const focusDelta =
    impact.focus < 0 ? impact.focus * focusStress : impact.focus * focusRelief;
  const switchingDelta =
    impact.switching < 0
      ? impact.switching * switchingRelief
      : impact.switching * switchingStress;
  const recoveryDelta =
    impact.recovery < 0
      ? impact.recovery * recoveryStress
      : impact.recovery * recoveryRelief;

  return {
    focus_capacity: clamp(state.focus_capacity + focusDelta),
    switching_fatigue: clamp(state.switching_fatigue + switchingDelta),
    recovery_level: clamp(state.recovery_level + recoveryDelta),
  };
};

export function calculateAttentionStateToday(
  initial: AttentionState,
  actions: AttentionAction[]
): AttentionState {
  let state = normalizeState(initial);
  if (!actions || actions.length === 0) {
    return state;
  }

  for (const action of actions) {
    const impact = ACTION_IMPACT[action.type];
    state = applyImpact(state, impact);
  }

  return state;
}
