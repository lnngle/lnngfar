import { describe,it,expect } from 'vitest';
import { startLifecycle, updateProjectState, getCurrentState, getCurrentPhase } from '../index';

describe('lifecycle',()=>{
  it('should start lifecycle',async()=>{
    await startLifecycle('develop');
    expect(getCurrentPhase()).toBe('develop');
  });
  it('should update state',()=>{
    updateProjectState({ modules: { user: 'developing' } });
    expect(getCurrentState().modules.user).toBe('developing');
  });
});
