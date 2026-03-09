import { logger } from "../../common/utils/Logger";
import { ResourceLoader } from "../../../framework/ResourceLoader";

export type BundleLoadStatus = "idle" | "loading" | "loaded" | "failed";

export class LoadingLayoutController {
    private readonly bundleStatus = new Map<string, BundleLoadStatus>();

    constructor(
        private readonly dirs: readonly string[],
        private readonly timeoutMs: number,
        private readonly retryCount: number,
        private readonly resourceLoader: ResourceLoader,
    ) {
        this.dirs.forEach((dir) => this.bundleStatus.set(dir, "idle"));
    }

    async load(onProgress: (finished: number, total: number) => void): Promise<void> {
        for (const dir of this.dirs) {
            this.bundleStatus.set(dir, "loading");
            await this.resourceLoader.loadDirWithRetry({
                dir,
                timeoutMs: this.timeoutMs,
                retryCount: this.retryCount,
                onProgress,
            });
            this.bundleStatus.set(dir, "loaded");
        }
    }

    markFailed(error: unknown): void {
        this.dirs.forEach((dir) => this.bundleStatus.set(dir, "failed"));
        logger.error("[LoadingLayoutController] 资源加载失败", error);
    }

    snapshot(): ReadonlyMap<string, BundleLoadStatus> {
        return this.bundleStatus;
    }
}
