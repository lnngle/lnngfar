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
  it('should transition through phases',async()=>{
    await startLifecycle('init');
    expect(getCurrentPhase()).toBe('init');
    await startLifecycle('verify');
    expect(getCurrentPhase()).toBe('verify');
    await startLifecycle('deploy');
    expect(getCurrentPhase()).toBe('deploy');
  });
});
