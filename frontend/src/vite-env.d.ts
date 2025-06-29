/// <reference types="vite/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "react/jsx-runtime" {
  export default any;
}

export {};
