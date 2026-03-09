import { oops } from "db://oops-framework/core/Oops";

export interface LoadDirWithRetryOptions {
    dir: string;
    timeoutMs: number;
    retryCount: number;
    onProgress?: (finished: number, total: number) => void;
}

export class ResourceLoader {
    loadDirWithTimeout(
        dir: string,
        timeoutMs: number,
        onProgress?: (finished: number, total: number) => void,
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let completed = false;
            const timer = setTimeout(() => {
                if (completed) {
                    return;
                }

                completed = true;
                reject(new Error(`资源加载超时: ${dir}`));
            }, timeoutMs);

            oops.res.loadDir(
                dir,
                (finished: number, total: number) => {
                    onProgress?.(finished, total);
                },
                () => {
                    if (completed) {
                        return;
                    }

                    completed = true;
                    clearTimeout(timer);
                    resolve();
                },
            );
        });
    }

    async loadDirWithRetry(options: LoadDirWithRetryOptions): Promise<void> {
        let lastError: unknown = null;

        for (let attempt = 0; attempt <= options.retryCount; attempt++) {
            try {
                await this.loadDirWithTimeout(options.dir, options.timeoutMs, options.onProgress);
                return;
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError;
    }
}
