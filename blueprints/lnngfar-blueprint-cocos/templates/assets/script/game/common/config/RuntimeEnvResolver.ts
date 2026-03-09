import { oops } from "db://oops-framework/core/Oops";
import { RuntimeConfigAsset, RuntimeConfigResolved, RuntimeEnv } from "../types/RuntimeConfig";

const ENV_SET: RuntimeEnv[] = ["dev", "test", "prod"];
const ENV_STORAGE_KEY = "env";
const ENV_GLOBAL_KEY = "LNNGFAR_ENV";

export function normalizeEnv(raw: string | null | undefined): RuntimeEnv | null {
    if (raw == null) {
        return null;
    }

    const value = raw.trim().toLowerCase();
    if (ENV_SET.includes(value as RuntimeEnv)) {
        return value as RuntimeEnv;
    }

    return null;
}

function readGlobalEnv(): RuntimeEnv | null {
    const globalValue = (globalThis as Record<string, unknown>)[ENV_GLOBAL_KEY];
    if (typeof globalValue !== "string") {
        return null;
    }

    return normalizeEnv(globalValue);
}

function readStorageEnv(): RuntimeEnv | null {
    try {
        return normalizeEnv(oops.storage.get(ENV_STORAGE_KEY));
    } catch {
        return null;
    }
}

export function resolveRuntimeEnv(config: RuntimeConfigAsset): RuntimeConfigResolved {
    const globalEnv = readGlobalEnv();
    if (globalEnv != null) {
        return { env: globalEnv, envConfig: config.config[globalEnv], source: "global" };
    }

    const storageEnv = readStorageEnv();
    if (storageEnv != null) {
        return { env: storageEnv, envConfig: config.config[storageEnv], source: "storage" };
    }

    return { env: config.type, envConfig: config.config[config.type], source: "config-default" };
}
