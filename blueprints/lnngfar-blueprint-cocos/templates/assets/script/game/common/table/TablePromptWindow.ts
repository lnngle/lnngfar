/*
 * @Author: dgflash
 * @Date: 2022-06-02 09:38:48
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-02 14:26:35
 */

import { JsonUtil } from "db://oops-framework/core/utils/JsonUtil";

interface PromptWindowRow {
    title: string;
    describe: string;
    array: unknown[];
    hp: number;
}

type PromptWindowTable = Record<number, Record<number, Record<number, PromptWindowRow>>>;

/** 演示oops-plugin-excel-to-json插件生成的配置表数据结构（可删除） */
export class TablePromptWindow {
    static TableName: string = "PromptWindow";

    private data: PromptWindowRow = { title: "", describe: "", array: [], hp: 0 };

    init(id: number, id1: number, id2: number) {
        const table = JsonUtil.get(TablePromptWindow.TableName) as PromptWindowTable;
        this.data = table[id][id1][id2];
        this.id = id;
        this.id1 = id1;
        this.id2 = id2;
    }

    id: number = 0;
    id1: number = 0;
    id2: number = 0;

    get title(): string {
        return this.data.title;
    }
    get describe(): string {
        return this.data.describe;
    }
    get array(): unknown[] {
        return this.data.array;
    }
    get hp(): number {
        return this.data.hp;
    }
}
