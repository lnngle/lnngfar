// @lnngfar/types - 共享类型定义

/** 项目配置 */
export interface LnngfarConfig {
  project: ProjectInfo;
  stack: StackRef;
  ai?: AiConfig;
  skills?: string[];
  templates?: TemplateConfig;
  test?: TestConfig;
  deploy?: DeployConfig;
}

export interface ProjectInfo {
  name: string;
  description: string;
  version: string;
  created: string;
}

export interface StackRef {
  name: string;
  version: string;
  source: string;
}

export interface AiConfig {
  provider: string;
  model: string;
  keyFrom: 'env' | 'file' | 'system-keychain' | 'enterprise-gateway';
  keyEnvVar?: string;
  maxTokens: number;
  temperature: number;
}

export interface TemplateConfig {
  backend?: string[];
  frontend?: string[];
}

export interface TestConfig {
  framework: {
    backend: string;
    frontend: string;
  };
  coverage: {
    target: number;
    enforce: 'warning' | 'error' | 'ignore';
  };
}

export interface DeployConfig {
  docker: boolean;
  kubernetes: boolean;
}

/** 工作区相关 */
export interface Workspace {
  root: string;
  packages: PackageInfo[];
  config: LnngfarConfig | null;
}

export interface PackageInfo {
  name: string;
  path: string;
}

export interface Project {
  name: string;
  path: string;
  config: LnngfarConfig;
}

export interface CreateOptions {
  stack?: string;
  template?: string;
  description?: string;
}

/** 日志 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}
