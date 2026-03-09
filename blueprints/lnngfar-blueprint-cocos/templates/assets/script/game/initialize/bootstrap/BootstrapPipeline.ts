import { logger } from "../../common/utils/Logger";

type BootstrapStage = {
    name: string;
    run: () => void | Promise<void>;
};

export class BootstrapPipeline {
    private readonly stages: BootstrapStage[] = [];

    addStage(name: string, run: () => void | Promise<void>): this {
        this.stages.push({ name, run });
        return this;
    }

    run(): void {
        void this.execute();
    }

    private async execute(): Promise<void> {
        for (const stage of this.stages) {
            try {
                await stage.run();
            } catch (error) {
                logger.error(`[BootstrapPipeline] 阶段失败: ${stage.name}`, error);
                break;
            }
        }
    }
}
