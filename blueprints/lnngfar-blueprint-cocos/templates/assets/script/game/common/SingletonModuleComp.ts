/*
 * @Author: dgflash
 * @Date: 2021-11-18 14:20:46
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-08 12:04:30
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { Account } from "../account/Account";
import { Initialize } from "../initialize/Initialize";

/** 游戏单例业务模块 */
@ecs.register('SingletonModule')
export class SingletonModuleComp extends ecs.Comp {
    private _initialize: Initialize | null = null;
    private _account: Account | null = null;

    /** 游戏初始化模块 */
    get initialize(): Initialize {
        if (this._initialize == null) {
            throw new Error('[SingletonModuleComp] initialize 尚未绑定');
        }

        return this._initialize;
    }

    /** 游戏账号模块 */
    get account(): Account {
        if (this._account == null) {
            throw new Error('[SingletonModuleComp] account 尚未绑定');
        }

        return this._account;
    }

    bindModules(initialize: Initialize, account: Account): void {
        this._initialize = initialize;
        this._account = account;
    }

    reset() {
        this._initialize = null;
        this._account = null;
    }
}

export const smc: SingletonModuleComp = ecs.getSingleton(SingletonModuleComp);