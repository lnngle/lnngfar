
import { JsonUtil } from "db://oops-framework/core/utils/JsonUtil";

interface LanguageRow {
    zh: string;
    en: string;
}

type LanguageTable = Record<number, LanguageRow>;

export class TableLanguage {
    static TableName: string = "Language";

    private data: LanguageRow = { zh: "", en: "" };

    init(id: number) {
        const table = JsonUtil.get(TableLanguage.TableName) as LanguageTable;
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 简体中文 */
    get zh(): string {
        return this.data.zh;
    }
    /** 英文 */
    get en(): string {
        return this.data.en;
    }
}
    