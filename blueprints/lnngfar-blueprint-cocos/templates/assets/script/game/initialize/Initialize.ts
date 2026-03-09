import { InitRes } from './bll/InitRes';

export class Initialize {
  private readonly initRes = new InitRes();

  public run(): void {
    this.initRes.preload();
  }
}
