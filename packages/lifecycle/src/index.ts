// @lnngfar/lifecycle - Lifecycle Engine

export type LifecyclePhase = 'init' | 'develop' | 'verify' | 'deploy' | 'ops' | 'evolve';
export interface ProjectState { phase: LifecyclePhase; modules: Record<string, string>; }

let state: ProjectState = { phase: 'init', modules: {} };

export async function startLifecycle(phase: LifecyclePhase): Promise<void> { state.phase = phase; }

export function updateProjectState(data: Partial<ProjectState>): void {
  Object.assign(state, data);
}

export function getCurrentState(): ProjectState { return state; }

export function getCurrentPhase(): LifecyclePhase { return state.phase; }
