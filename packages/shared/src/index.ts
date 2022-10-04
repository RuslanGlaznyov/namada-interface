/* eslint-disable */
import initWasm, { InitOutput } from "./shared/shared";
import wasm from "./shared/shared_bg.wasm";

export const init: () => Promise<InitOutput> = async () => await initWasm(wasm);

export * from "./shared/shared";
export * from "./schema";
