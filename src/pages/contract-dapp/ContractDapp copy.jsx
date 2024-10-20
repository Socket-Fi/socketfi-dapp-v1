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
  const [deploySelected, setDeploySelected] = useState(true);
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
    <div className="space-y-4 pb-10 bg-gray-100">
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

            <div className="max-w-5xl mx-auto mt-12 sm:mt-16 space-y-4">
              <div className="gap-4 ">
                <div className="grid grid-cols-1 gap-6 px-8 text-center md:px-0 md:grid-cols-2">
                  <button
                    className={`p-4  flex items-center text-center justify-center overflow-hidden  rounded-xl ${
                      deploySelected ? "bg-gray-400" : "bg-white"
                    }`}
                    onClick={() => setDeploySelected(true)}
                  >
                    {/* <SecuritySafe
                    size="32"
                    color="#555555"
                    className="flex-shrink-0 w-10 h-10 mx-10 text-gray-400"
                  /> */}
                    <ElementPlus
                      size="32"
                      color="#555555"
                      className="flex-shrink-0 w-10 h-10 mx-10 text-gray-400"
                    />
                    <p className=" text-lg font-medium text-gray-900">
                      Deploy Contract Soroban Contract
                    </p>
                  </button>

                  <button
                    className={`p-4  flex items-center text-center justify-center overflow-hidden  rounded-xl ${
                      !deploySelected ? "bg-gray-400" : "bg-white"
                    }`}
                    onClick={() => setDeploySelected(false)}
                  >
                    <FolderAdd
                      size="32"
                      color="#555555"
                      className="flex-shrink-0 w-10 h-10 mx-10 text-gray-400"
                    />
                    <p className=" text-lg font-medium leading-relaxed text-gray-900">
                      Load and interact with contract
                    </p>
                  </button>
                </div>
              </div>
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
                {connecting ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
