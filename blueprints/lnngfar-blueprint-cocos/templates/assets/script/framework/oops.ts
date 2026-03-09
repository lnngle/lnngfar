import { oops } from "db://oops-framework/core/Oops";
import { UIConfig } from "db://oops-framework/core/gui/layer/UIConfig";

export interface GuiAdapter {
    init(config: Record<number, UIConfig>): void;
    open(uiId: number, options?: unknown): Promise<unknown>;
}

class OopsGuiAdapter implements GuiAdapter {
    init(config: Record<number, UIConfig>): void {
        oops.gui.init(config);
    }

    open(uiId: number, options?: unknown): Promise<unknown> {
        return Promise.resolve(oops.gui.open(uiId, options));
    }
}

export const guiAdapter: GuiAdapter = new OopsGuiAdapter();
