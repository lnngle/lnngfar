import { describe,it,expect } from 'vitest';
import { runTests, runRegressionTests, validateQuality } from '../index';

describe('runTests',()=>{
  it('should return result object',async()=>{
    const r=await runTests();
    expect(r.passed).toBeDefined();
    expect(r.failed).toBeDefined();
  });
});

describe('runRegressionTests',()=>{
  it('should return result object',async()=>{
    const r=await runRegressionTests();
    expect(r.passed).toBeDefined();
  });
});

describe('validateQuality',()=>{
  it('should pass when all gates check',()=>{
    const r=validateQuality([{name:'lint',check:()=>true},{name:'types',check:()=>true}]);
    expect(r.coverage).toBe(100);
  });
  it('should fail when gate fails',()=>{
    const r=validateQuality([{name:'lint',check:()=>false}]);
    expect(r.coverage).toBe(0);
  });
});
