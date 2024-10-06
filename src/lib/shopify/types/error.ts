/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Error Types                                  ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export interface ErrorLocation {
  line: number;
  column: number;
}

export interface ErrorExtensions {
  code: string;
  documentation: string;
  requiredAccess: string;
}

export interface Error {
  message: string;
  locations: ErrorLocation[];
  path: string[];
  extensions: ErrorExtensions;
}

export interface UserError {
  field?: string[];
  message: string;
}
