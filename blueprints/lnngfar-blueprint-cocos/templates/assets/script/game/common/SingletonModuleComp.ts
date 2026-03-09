import type { Initialize } from '../initialize/Initialize';

class SingletonModuleComp {
  public initialize: Initialize | null = null;
}

export const smc = new SingletonModuleComp();
