import { describe,it,expect } from 'vitest';
import { renderTemplate, composeTemplate, type Template } from '../index';

describe('renderTemplate',()=>{
  it('should replace variables',()=>{
    expect(renderTemplate('Hello {{name}}',{name:'World'})).toBe('Hello World');
  });
  it('should keep unknown vars',()=>{
    expect(renderTemplate('{{x}}',{})).toBe('{{x}}');
  });
  it('should handle multiple vars',()=>{
    expect(renderTemplate('{{a}} {{b}}',{a:'1',b:'2'})).toBe('1 2');
  });
});

describe('composeTemplate',()=>{
  it('should join templates',()=>{
    const a:Template={name:'a',content:'A',source:'x'};
    const b:Template={name:'b',content:'B',source:'y'};
    const c=composeTemplate([a,b]);
    expect(c.content).toBe('A\nB');
    expect(c.name).toBe('a+b');
  });
});
