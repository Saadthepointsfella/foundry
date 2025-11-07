// packages/adapters/evmSolidity.ts
import type {
  Framework,
  FrameworkAdapter,
  FrameworkSelection,
  Mode,
  AdapterResolution
} from "@vibefoundry/core";

export const evmSolidityFramework: Framework = {
  id: "evm-solidity",
  name: "EVM / Solidity",
  description: "Smart contracts on EVM-compatible chains.",
  category: "blockchain",
  basePackIds: [
    "evm.state.det",
    "evm.sec.math"
  ],
  variantDimensions: [
    {
      id: "contract-type",
      label: "Contract type",
      description: "What kind of contract are you building?",
      options: [
        { id: "erc20", label: "ERC-20 / fungible token" },
        { id: "erc721", label: "ERC-721 / NFT" },
        { id: "governance", label: "Governance / timelock" },
        { id: "other", label: "Other / custom" }
      ],
      defaultByMode: {
        vibe: "other",
        pro: "erc20"
      }
    },
    {
      id: "upgradeability",
      label: "Upgradeability",
      description: "Are upgrades expected?",
      options: [
        { id: "immutable", label: "Immutable" },
        { id: "proxy", label: "Upgradeable via proxy" }
      ],
      defaultByMode: {
        vibe: "immutable",
        pro: "proxy"
      }
    }
  ]
};

function mapVariants(selection: FrameworkSelection): Record<string, string> {
  const m: Record<string, string> = {};
  for (const v of selection.variants) m[v.dimensionId] = v.optionId;
  return m;
}

function resolveEvmSolidity(
  mode: Mode,
  selection: FrameworkSelection
): AdapterResolution {
  const variants = mapVariants(selection);
  const packIds = new Set<string>(evmSolidityFramework.basePackIds ?? []);

  const contractType = variants["contract-type"];
  const upgradeability = variants["upgradeability"];

  packIds.add("evm.sec.reentrancy-acl");
  packIds.add("evm.econ.invariants");
  packIds.add("evm.perf.gas-budget");

  if (upgradeability === "proxy") {
    // You could later add an explicit upgradeability pack.
    packIds.add("evm.upgradeability.proxy"); // optional future pack id
  }

  return {
    frameworkId: evmSolidityFramework.id,
    packIds: Array.from(packIds),
    planHints: [contractType, upgradeability].filter(Boolean) as string[]
  };
}

export const evmSolidityAdapter: FrameworkAdapter = {
  framework: evmSolidityFramework,
  resolveVariants: resolveEvmSolidity
};
