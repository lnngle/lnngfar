import { JsonAsset, resources } from "cc";
import { oops } from "db://oops-framework/core/Oops";
import { RuntimeConfigAsset, RuntimeConfigResolved } from "../types/RuntimeConfig";
import { validateRuntimeConfigAsset } from "./RuntimeConfigGuards";
import { resolveRuntimeEnv } from "./RuntimeEnvResolver";

export class RuntimeConfigService {
    private static loadPromise: Promise<RuntimeConfigAsset> | null = null;
    private static cachedConfig: RuntimeConfigAsset | null = null;
    private static resolved: RuntimeConfigResolved | null = null;

    static preload(): Promise<RuntimeConfigAsset> {
        if (this.loadPromise != null) {
            return this.loadPromise;
        }

        this.loadPromise = new Promise<RuntimeConfigAsset>((resolve, reject) => {
            resources.load("config", JsonAsset, (error, asset) => {
                if (error != null) {
                    this.loadPromise = null;
                    reject(error);
                    return;
                }

                try {
                    validateRuntimeConfigAsset(asset.json);
                    this.cachedConfig = asset.json;
                    this.resolved = this.resolveConfig(asset.json);
                    resolve(asset.json);
                } catch (validationError) {
                    this.loadPromise = null;
                    reject(validationError);
                }
            });
        });

        return this.loadPromise;
    }

    static getResolved(): RuntimeConfigResolved | null {
        return this.resolved;
    }

    static shouldShowProfiler(debugFlag: boolean): boolean {
        if (!debugFlag) {
            return false;
        }

        const resolved = this.resolved;
        if (resolved == null) {
            return true;
        }

        return resolved.envConfig.stats;
    }

    static resolveLanguage(defaultLanguage: string): string {
        if (this.cachedConfig == null) {
            return defaultLanguage;
        }

        let value: string | null = null;
        try {
            value = oops.storage.get("language") as string | null;
        } catch {
            value = null;
        }

        if (typeof value === "string" && this.cachedConfig.language.type.includes(value)) {
            return value;
        }

        return this.cachedConfig.language.default;
    }

    static ensureLanguagePathsValid(): void {
        if (this.cachedConfig == null) {
            return;
        }

        const languagePath = this.cachedConfig.language.path;
        if (!languagePath.json || !languagePath.texture) {
            throw new Error("language.path 配置不完整");
        }
    }

    private static resolveConfig(config: RuntimeConfigAsset): RuntimeConfigResolved {
        return resolveRuntimeEnv(config);
    }
}
