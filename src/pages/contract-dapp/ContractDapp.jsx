import { useEffect, useState } from "react";

import {
  Operation,
  TimeoutInfinite,
  Keypair,
  StrKey,
  Address,
  hash,
  Contract,
} from "@stellar/stellar-sdk";
import { signTransaction, getNetworkDetails } from "@stellar/freighter-api";
// import arrayBufferToBuffer from "arraybuffer-to-buffer";

import {
  server,
  getTxBuilder,
  FUTURENET_DETAILS,
  BASE_FEE,
  submitTx,
  ConnectWallet,
} from "../../utils/soroban";

import DeployContract from "./DeployContract";
import InvokeContract from "./InvokeContract";
import { ElementPlus, FolderAdd } from "iconsax-react";

export default function ContractDapp({
  userKey,
  setNetwork,
  setUserKey,
  isWalletInstalled,
  connecting,
  setConnecting,
}) {
  const [deploySelected, setDeploySelected] = useState(false);
  const [loadedContractId, setLoadedContractId] = useState("");

  async function handleConnect() {
    setConnecting(() => true);
    await ConnectWallet(setUserKey, setNetwork);
    setConnecting(() => false);
  }

  useEffect(() => {
    async function getNetwork() {
      const result = await getNetworkDetails();
      console.log("the network details are", result);
    }
    getNetwork();
  }, []);

  return (
    <div className="space-y-4 pb-10 bg-gray-100 h-screen">
      <div className="overflow-x-hidden bg-gray-100">
        <div className=" bg-gray-100 sm:pt-16 lg:pt-18">
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Non-Custodial Smart Wallet
              </h2>
              <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-500">
                A decentralized smart wallet dApp seamlessly connecting millions
                of social media users to Web3 features, tools, and value.
              </p>
            </div>
          </div>
        </div>
      </div>

      {deploySelected ? (
        <DeployContract
          userKey={userKey}
          setUserKey={setUserKey}
          setNetwork={setNetwork}
          isWalletInstalled={isWalletInstalled}
          setLoadedContractId={setLoadedContractId}
          setDeploySelected={setDeploySelected}
          connecting={connecting}
          setConnecting={setConnecting}
        />
      ) : (
        <InvokeContract
          userKey={userKey}
          setUserKey={setUserKey}
          setNetwork={setNetwork}
          isWalletInstalled={isWalletInstalled}
          setLoadedContractId={setLoadedContractId}
          loadedContractId={loadedContractId}
          connecting={connecting}
          setConnecting={setConnecting}
        />
      )}

      <div className="max-w-5xl mx-auto  space-y-4 px-4  sm:px-6 lg:px-0 ">
        {!isWalletInstalled ? (
          <div className="sm:col-span-2 mt-4">
            <a
              href="https://www.freighter.app/"
              className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              role="button"
              target="_blank"
            >
              Install Freighter
            </a>
          </div>
        ) : (
          userKey?.length <= 0 && (
            <div className="sm:col-span-2">
              <button
                onClick={handleConnect}
                className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="button"
              >
                {connecting
                  ? "Connecting..."
                  : "Create Smart Wallet using External Wallet"}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
