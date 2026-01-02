declare module 'set-cookie-parser' {
  export interface Cookie {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    expires?: Date;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  }

  export interface ParseOptions {
    map?: boolean;
    silent?: boolean;
  }

  export function parse(
    input: string | string[],
    options?: ParseOptions
  ): Cookie[];
  export function splitCookiesString(cookiesString: string): string[];

  export default parse;
}
