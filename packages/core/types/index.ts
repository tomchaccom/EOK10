// Attention state
export interface AttentionState {
    focus_capacity: number;
    switching_fatigue: number;
    recovery_level: number;
  }
  
  // Actions
  export type AttentionActionType =
    | "study"
    | "sns"
    | "meeting"
    | "move"
    | "rest";
  
  export interface AttentionAction {
    type: AttentionActionType;
  }
  
  // Task demand
  export interface AttentionDemand {
    focus: number;
    switching: number;
    emotional: number;
  }
  
  // Feasibility
  export type FeasibilityStatus = "OK" | "RISK" | "OVERLOAD";
  
  export interface FeasibilityResult {
    score: number;
    status: FeasibilityStatus;
  }
  
  // Execution
  export type ExecutionTarget = "HUMAN" | "AGENT";
  
  // Offload result (⭐ 중요)
  export interface OffloadDecision {
    taskId: string;
    executeBy: ExecutionTarget;
    offloadScore: number;
  }
  
  // Task
  export interface Task {
    id: string;
    title: string;
    description?: string;
    attention_demand: AttentionDemand;
    automation_affinity: number; // 0~1
    risk: number;                // 0~1
  }
  