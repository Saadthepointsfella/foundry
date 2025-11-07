// packages/packs/index.ts
import type { InvariantPack, PackRegistry } from "@vibefoundry/core";

import frontendReact from "./frontend-react.json";
import backendFlask from "./backend-flask.json";
import mlPytorch from "./ml-pytorch.json";
import evmSolidity from "./evm-solidity.json";
import opsK8s from "./ops-k8s.json";
import crossCutting from "./cross-cutting.json";

const allPackArrays: InvariantPack[][] = [
  frontendReact as InvariantPack[],
  backendFlask as InvariantPack[],
  mlPytorch as InvariantPack[],
  evmSolidity as InvariantPack[],
  opsK8s as InvariantPack[],
  crossCutting as InvariantPack[]
];

const packs: PackRegistry = {};

for (const arr of allPackArrays) {
  for (const pack of arr) {
    packs[pack.id] = pack;
  }
}

export { packs };
