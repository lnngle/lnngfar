import { describe,it,expect } from 'vitest';
import { runTests, validateQuality } from '../index';

describe('runTests',()=>{
  it('should return result object',async()=>{
    const r=await runTests();
    expect(r.passed).toBeDefined();
    expect(r.failed).toBeDefined();
  });
});

describe('validateQuality',()=>{
  it('should pass when all gates check',()=>{
    const r=validateQuality([{name:'lint',check:()=>true},{name:'types',check:()=>true}]);
    expect(r.coverage).toBe(100);
  });
});
