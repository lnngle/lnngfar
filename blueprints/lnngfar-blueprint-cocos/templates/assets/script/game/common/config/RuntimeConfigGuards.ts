import { RuntimeConfigAsset, RuntimeEnv } from "../types/RuntimeConfig";
import { GUI_LAYER_NAME_SET, GUI_LAYER_TYPE_SET } from "./GuiLayerRegistry";

const ENV_SET: RuntimeEnv[] = ["dev", "test", "prod"];

function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

export function validateRuntimeConfigAsset(input: unknown): asserts input is RuntimeConfigAsset {
    const data = input as RuntimeConfigAsset;
    assert(!!data, "config.json 为空");
    assert(typeof data === "object", "config.json 不是对象");
    assert(data.config != null, "config.json 缺少 config 节点");
    assert(data.language != null, "config.json 缺少 language 节点");
    assert(data.bundle != null, "config.json 缺少 bundle 节点");

    ENV_SET.forEach((env) => {
        assert(data.config[env] != null, `config.${env} 缺失`);
    });

    assert(Array.isArray(data.language.type), "language.type 必须是数组");
    assert(data.language.type.length > 0, "language.type 不能为空");
    assert(typeof data.language.default === "string", "language.default 必须是字符串");
    assert(data.language.type.includes(data.language.default), "language.default 必须包含在 language.type 中");

    assert(Array.isArray(data.gui), "gui 必须是数组");
    data.gui.forEach((item) => {
        assert(typeof item.name === "string", "gui.name 必须是字符串");
        assert(typeof item.type === "string", "gui.type 必须是字符串");
        assert(GUI_LAYER_NAME_SET.has(item.name), `未知 GUI 层名称: ${item.name}`);
        assert(GUI_LAYER_TYPE_SET.has(item.type), `未知 GUI 层类型: ${item.type}`);
    });

    assert(typeof data.language.path?.json === "string", "language.path.json 缺失");
    assert(typeof data.language.path?.texture === "string", "language.path.texture 缺失");
    assert(typeof data.bundle.default === "string", "bundle.default 缺失");
}
