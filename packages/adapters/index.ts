// packages/adapters/index.ts
import type { AdapterRegistry } from "@vibefoundry/core";

import { frontendReactAdapter } from "./frontendReact";
import { backendFlaskAdapter } from "./backendFlask";
import { mlPytorchAdapter } from "./mlPytorch";
import { evmSolidityAdapter } from "./evmSolidity";
import { opsK8sAdapter } from "./opsK8s";
import { crossCuttingAdapter } from "./crossCutting";

export const adapterRegistry: AdapterRegistry = {
  [frontendReactAdapter.framework.id]: frontendReactAdapter,
  [backendFlaskAdapter.framework.id]: backendFlaskAdapter,
  [mlPytorchAdapter.framework.id]: mlPytorchAdapter,
  [evmSolidityAdapter.framework.id]: evmSolidityAdapter,
  [opsK8sAdapter.framework.id]: opsK8sAdapter,
  [crossCuttingAdapter.framework.id]: crossCuttingAdapter
};

export const adapters: AdapterRegistry = adapterRegistry;

export const adapterList = [
  frontendReactAdapter,
  backendFlaskAdapter,
  mlPytorchAdapter,
  evmSolidityAdapter,
  opsK8sAdapter,
  crossCuttingAdapter
];

export {
  frontendReactAdapter,
  backendFlaskAdapter,
  mlPytorchAdapter,
  evmSolidityAdapter,
  opsK8sAdapter,
  crossCuttingAdapter
};
