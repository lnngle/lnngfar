export async function retry<T>(action: () => Promise<T>, maxRetry: number): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= maxRetry; attempt++) {
        try {
            return await action();
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError;
}
