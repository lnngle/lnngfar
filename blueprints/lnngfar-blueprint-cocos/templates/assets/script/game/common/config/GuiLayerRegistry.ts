export enum GuiLayerName {
    LayerGame = "LayerGame",
    LayerUI = "LayerUI",
    LayerPopUp = "LayerPopUp",
    LayerDialog = "LayerDialog",
    LayerSystem = "LayerSystem",
    LayerNotify = "LayerNotify",
    LayerGuide = "LayerGuide",
}

export enum GuiLayerType {
    Game = "Game",
    UI = "UI",
    PopUp = "PopUp",
    Dialog = "Dialog",
    Notify = "Notify",
    Node = "Node",
}

export const GUI_LAYER_NAME_SET = new Set<string>(Object.values(GuiLayerName));
export const GUI_LAYER_TYPE_SET = new Set<string>(Object.values(GuiLayerType));
