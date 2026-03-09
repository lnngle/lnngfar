/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2023-02-15 09:38:36
 */

import { LayerType } from "db://oops-framework/core/gui/layer/LayerEnum";
import { UIConfig } from "db://oops-framework/core/gui/layer/UIConfig";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 游戏资源加载界面 */
    Loading,
    /** 演示界面 */
    Demo,
    /** 提示弹出窗口 */
    Alert,
    /** 确认弹出窗口 */
    Confirm,
}

/** 首个业务界面标识 */
export const BootUI: UIID = UIID.Loading;

/** 打开界面方式的配置数据 */
export const UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "gui/layouts/loading/loading" },
    [UIID.Demo]: { layer: LayerType.UI, prefab: "gui/screens/demo/demo" },
    [UIID.Alert]: { layer: LayerType.Dialog, prefab: "common/prefab/alert" },
    [UIID.Confirm]: { layer: LayerType.Dialog, prefab: "common/prefab/confirm" },
}