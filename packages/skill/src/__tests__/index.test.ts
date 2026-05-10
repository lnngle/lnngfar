import { describe,it,expect } from 'vitest';
import { loadSkill, composeSkills, loadSkillsFromStack } from '../index';
import { resolve } from 'node:path';

describe('loadSkill',()=>{
  it('should load coding skill from stack',()=>{
    // Test with far-web-java's skill - build one if not exists
    const { existsSync,mkdirSync,writeFileSync } = require('node:fs');
    const dir=resolve(__dirname,'../../../../skills/coding');
    if(!existsSync(dir)){mkdirSync(dir,{recursive:true});
      writeFileSync(resolve(dir,'skill.yaml'),'name: coding\nversion: 1.0\ntype: rule\npriority: 10\nprompt: "Follow coding rules"');
    }
    const s = loadSkill('coding',resolve(__dirname,'../../../../skills/coding'));
    expect(s.definition.name).toBe('coding');
    expect(s.definition.priority).toBe(10);
  });
});

describe('composeSkills',()=>{
  it('should join prompts',()=>{
    const s1={definition:{name:'a',version:'1',type:'rule',priority:1,prompt:'A'},path:''};
    const s2={definition:{name:'b',version:'1',type:'rule',priority:2,prompt:'B'},path:''};
    expect(composeSkills([s1,s2])).toBe('A\n\nB');
  });
});
