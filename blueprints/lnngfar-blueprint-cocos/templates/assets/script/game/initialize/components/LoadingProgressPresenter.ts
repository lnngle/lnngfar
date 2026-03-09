import { oops } from "db://oops-framework/core/Oops";

export interface LoadingViewData {
    finished: number;
    total: number;
    progress: string;
    prompt: string;
}

export class LoadingProgressPresenter {
    private progressRatio = 0;

    constructor(private readonly data: LoadingViewData) {}

    reset(): void {
        this.progressRatio = 0;
        this.data.finished = 0;
        this.data.total = 0;
        this.data.progress = "0.00";
        this.data.prompt = "";
    }

    showPromptByLang(langId: string): void {
        this.data.prompt = oops.language.getLangByID(langId);
    }

    setPrompt(text: string): void {
        this.data.prompt = text;
    }

    updateProgress(finished: number, total: number): void {
        this.data.finished = finished;
        this.data.total = total;

        if (total <= 0) {
            return;
        }

        const ratio = finished / total;
        if (ratio <= this.progressRatio) {
            return;
        }

        this.progressRatio = ratio;
        this.data.progress = (ratio * 100).toFixed(2);
    }
}
