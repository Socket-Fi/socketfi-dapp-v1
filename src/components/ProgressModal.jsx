import { CloseCircle } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { signTransaction, requestAccess } from "@stellar/freighter-api";

import {
  ScInt,
  Soroban,
  StrKey,
  nativeToScVal,
  Keypair,
  TimeoutInfinite,
  Operation,
  Contract,
  SorobanRpc,
  Memo,
} from "@stellar/stellar-sdk";
import {
  server,
  getTxBuilder,
  FUTURENET_DETAILS,
  xlmToStroop,
  submitTx,
  accountToScVal,
  anyInvoke,
  getAccount,
  loadContract,
  BASE_FEE,
  ConnectWallet,
  uploadWasmSigner,
} from "../utils/soroban";
import { contracts } from "../contract";
import {
  hashPassword,
  encrypt,
  decrypt,
  generateKey,
  generateSalt,
  randomKeySelect,
  validatePassword,
  signerSelect,
} from "../utils/config";

export default function ProgressModal({
  isOpen,
  onClose,
  setUserKey,
  setNetwork,
  createStatus,
  setCreateStatus,
  createStatusTwitter,
  setCreateStatusTwitter,
  userKey,
  getUser,
  smartAccount,
  setSmartAccount,
  onUseTwitter,
  isUseTwitter,
  handleTwitterBack,
  setCreateWithTwitter,
  twiterAccount,
  setIsOpen,
  children,
  processProgress,
}) {
  const {
    VITE_ENCRYPTION_ALGORITHM,
    VITE_ALGORITHM_VERSION,
    VITE_SALT_ENCRYPTION,
    VITE_ENCRYPTION_KEYS_ARRAY,
    VITE_INDEX_ENCRYPTION_KEY,
    VITE_SECRET,
  } = import.meta.env;

  const encryptionKeys = VITE_ENCRYPTION_KEYS_ARRAY
    ? VITE_ENCRYPTION_KEYS_ARRAY.split(",")
    : [];
  const signers = VITE_SECRET ? VITE_SECRET.split("#") : [];
  const smartWalletContract =
    "CB43FX5FT7363N6FRZOZWLBA5YNSEYGYPPVZ6ATXTFNAORZ3QX4SZKHT";
  const XLMId = "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT";
  const selectedNetwork = FUTURENET_DETAILS;
  const { network, networkPassphrase } = selectedNetwork;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [maxAllowance, setMaxAllowance] = useState(100);

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden bg-white rounded-xl">
      <div className="relative cursor-pointer" role="button" onClick={onClose}>
        <CloseCircle className="text-gray-900 h-7 w-auto absolute top-2 right-2" />
        {/* Other content here */}
      </div>

      <div className="p-8">
        <div className="text-center">
          {processProgress?.isDone ? (
            <svg
              className="w-10 h-10 mx-auto text-green-600 "
              width="144"
              height="144"
              viewBox="0 0 144 144"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M54.1103 100C55.6658 102.333 57.9992 103.111 60.3325 103.111C62.6658 103.111 64.9992 102.333 66.5547 100L101.555 53.3335C103.888 50.2224 103.11 44.7779 99.9992 42.4446C96.8881 40.1113 91.4436 40.889 89.1103 44.0001L60.3325 82.1113L54.8881 75.1113C52.5547 72.0001 47.1103 71.2224 43.9992 73.5557C40.8881 75.889 40.1103 81.3335 42.4436 84.4446L54.1103 100Z"
                fill="currentColor"
              />
              <path
                d="M72 142C110.889 142 142 110.889 142 72C142 33.1111 110.889 2 72 2C33.1111 2 2 33.1111 2 72C2 110.889 33.1111 142 72 142ZM72 17.5556C102.333 17.5556 126.444 41.6667 126.444 72C126.444 102.333 102.333 126.444 72 126.444C41.6667 126.444 17.5556 102.333 17.5556 72C17.5556 41.6667 41.6667 17.5556 72 17.5556Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              className="w-10 h-10 mx-auto text-gray-900 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}

          <p className="mt-8 text-xl font-bold text-gray-900">{children}</p>
          <p className="mt-3 text-base font-medium text-gray-600">
            This can take a few minutes depending on gas. Don’t leave this page.
            You can do whatever you want.
          </p>
          <div className="mt-8">
            <button
              type="button"
              className="inline-flex items-center justify-center w-full px-6 py-4 text-xs font-bold tracking-widest text-gray-900 uppercase transition-all duration-200 bg-transparent border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-900 hover:text-white"
            >
              View Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
