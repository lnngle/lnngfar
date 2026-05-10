import { describe,it,expect } from 'vitest';
import { buildPrompt, loadContext, analyzeIntent, optimizeTokens } from '../index';

describe('buildPrompt',()=>{
  it('should construct prompt with context',()=>{
    const p=buildPrompt('generate user module',{module:'user',specs:'specs/user',stackName:'far-web-java'});
    expect(p.system).toContain('far-web-java');
    expect(p.context).toContain('user');
    expect(p.task).toBe('generate user module');
  });
});

describe('analyzeIntent',()=>{
  it('should recognize create intent',()=>expect(analyzeIntent('生成订单模块')).toBe('create'));
  it('should recognize modify intent',()=>expect(analyzeIntent('修改登录逻辑')).toBe('modify'));
  it('should recognize optimize intent',()=>expect(analyzeIntent('优化查询')).toBe('optimize'));
});
