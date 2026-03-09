export type RuntimeEnv = "dev" | "test" | "prod";

export interface EnvConfig {
    version: string;
    localDataKey: string;
    localDataIv: string;
    frameRate: number;
    loadingTimeoutGui: number;
    mobileSafeArea: boolean;
    stats: boolean;
    httpServer: string;
    httpTimeout: number;
    webSocketServer: string;
    webSocketHeartTime: number;
    webSocketReceiveTime: number;
    webSocketReconnetTimeOut: number;
}

export interface GuiLayerConfigItem {
    name: string;
    type: string;
}

export interface LanguageConfig {
    default: string;
    type: string[];
    path: {
        json: string;
        texture: string;
        spine: string;
    };
}

export interface BundleConfig {
    default: string;
}

export interface RuntimeConfigAsset {
    type: RuntimeEnv;
    config: Record<RuntimeEnv, EnvConfig>;
    gui: GuiLayerConfigItem[];
    language: LanguageConfig;
    bundle: BundleConfig;
}

export interface RuntimeConfigResolved {
    env: RuntimeEnv;
    envConfig: EnvConfig;
    source: "global" | "storage" | "config-default";
}
