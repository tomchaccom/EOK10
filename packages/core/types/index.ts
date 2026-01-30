export type AttentionState = number;

export type FeasibilityResult = "OK" | "RISK" | "OVERLOAD";

export type OffloadDecision = "HUMAN" | "AGENT";

export interface Action {
  id: string;
  label: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  attention: AttentionState;
  feasibility: FeasibilityResult;
  offloadDecision: OffloadDecision;
  actions?: Action[];
}
// 주석 추가하기 
