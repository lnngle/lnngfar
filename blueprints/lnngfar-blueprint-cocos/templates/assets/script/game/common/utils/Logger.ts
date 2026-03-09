import { DEBUG } from "cc/env";
import { RuntimeConfigService } from "../config/RuntimeConfigService";

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};

function getCurrentLevel(): LogLevel {
    const resolved = RuntimeConfigService.getResolved();
    if (resolved == null) {
        return DEBUG ? "debug" : "info";
    }

    if (resolved.env === "prod") {
        return "warn";
    }

    return DEBUG ? "debug" : "info";
}

function canLog(target: LogLevel): boolean {
    return LEVEL_ORDER[target] >= LEVEL_ORDER[getCurrentLevel()];
}

export const logger = {
    debug(message: string, ...args: unknown[]): void {
        if (canLog("debug")) {
            console.debug(message, ...args);
        }
    },
    info(message: string, ...args: unknown[]): void {
        if (canLog("info")) {
            console.info(message, ...args);
        }
    },
    warn(message: string, ...args: unknown[]): void {
        if (canLog("warn")) {
            console.warn(message, ...args);
        }
    },
    error(message: string, ...args: unknown[]): void {
        if (canLog("error")) {
            console.error(message, ...args);
        }
    },
};
