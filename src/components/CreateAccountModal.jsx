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
  randomKeySelect,
  validatePassword,
  hashEnteredPassword,
  selectSigner,
  encryptText,
  updateStat,
} from "../utils/config";
import ProgressModal from "./ProgressModal";

export default function CreateAccountModal({
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
  onUseTwitter,
  isUseTwitter,
  handleTwitterBack,
  setCreateWithTwitter,
  twiterAccount,
  setIsOpen,
  smartWalletContract,
  processProgress,
  setProcessProgress,
  setDataUpdate,
  smartAccountCreatedWithTwitter,
  isFetching,
  setIsFetching,
  smartAccountIds,
  setSmartAccountIds,
}) {
  const {
    VITE_ENCRYPTION_ALGORITHM,

    VITE_ENCRYPTION_KEYS_ARRAY,
    VITE_INDEX_ENCRYPTION_KEY,
    VITE_SECRET,
  } = import.meta.env;

  const encryptionKeys = VITE_ENCRYPTION_KEYS_ARRAY
    ? VITE_ENCRYPTION_KEYS_ARRAY.split(",")
    : [];
  const signers = VITE_SECRET ? VITE_SECRET.split("#") : [];

  const selectedNetwork = FUTURENET_DETAILS;
  const { network, networkPassphrase } = selectedNetwork;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [maxAllowance, setMaxAllowance] = useState(100);

  if (!isOpen || isFetching) return null; // Don't render the modal if it's not open

  let openCreateWithTwitterModal = false;

  if (
    smartAccountCreatedWithTwitter.length === 0 &&
    isUseTwitter &&
    twiterAccount !== null
  ) {
    openCreateWithTwitterModal = true;
  } else {
    openCreateWithTwitterModal = false;
  }

  const wasmFile = contracts[3]?.wasmfile;

  const processStart = (message) => {
    // Run these lines immediately
    setDataUpdate(() => message);

    setProcessProgress((pre) => ({
      ...pre,
      message: message,
      isDone: false,
    }));
  };

  const processEnd = (message, e) => {
    // Run these lines immediately
    setDataUpdate(() => message);
    setProcessProgress((pre) => ({
      ...pre,
      message: message,
      isDone: true,
    }));

    // Delay only the onCloseSend() function by 5 seconds
    setTimeout(() => {
      setDataUpdate("");
      setProcessProgress((pre) => ({
        ...pre,
        message: "",
        isDone: false,
      }));

      setIsOpen(false);
      onClose(e);
    }, 2000);
  };
  async function handleCreateWithWallet(e) {
    localStorage.setItem("selectedMethod", "wallet");
    // setCreateStatus("Connecting ...");
    processStart("connecting...");
    const key = await ConnectWallet(setUserKey, setNetwork);
    // console.log("the connected is", key);

    if (key.length > 0) {
      const txBuilder = await getTxBuilder(
        key,
        BASE_FEE,
        server,
        selectedNetwork.networkPassphrase
      );

      const res = await getAccount({
        walletId: smartWalletContract,
        userPubKey: key,
        txBuilderAccount: txBuilder,
        server: server,
      });

      // console.log("get account res", res);

      if (res !== null) {
        const account = { owner: key, accountId: res };
        setSmartAccountIds(account);
        processEnd("Connected", e);
        return;
      }
    }

    if (key.length > 0 && smartAccountIds.length === 0) {
      processStart("Loading contract...");

      setCreateStatus("Loading Contract...");

      const connectedUser = await requestAccess();

      // console.log("connected user is", connectedUser);

      const wasmFetched = await fetch(wasmFile);
      const loadedWasmBuffer = await wasmFetched.arrayBuffer();
      // console.log("wasm file loaded", loadedWasmBuffer);

      const txBuilderUpload = await getTxBuilder(
        connectedUser,
        xlmToStroop(1).toString(),
        server,
        selectedNetwork.networkPassphrase
      );

      // console.log("transaction built", txBuilderUpload);
      const wasm = loadedWasmBuffer;

      const signedXdrLoad = await loadContract(wasm, txBuilderUpload);

      const txHash = await submitTx(signedXdrLoad, networkPassphrase, server);
      const loadedWasm = txHash.returnValue._value;
      // console.log("the loaded contract is", loadedWasm);
      const createOperation = "create_account_addr";

      const invokeArgs = [createOperation];
      invokeArgs.push(accountToScVal(connectedUser));
      invokeArgs.push(nativeToScVal(loadedWasm));
      setCreateStatus("Creating Account...");
      processStart("Creating account...");
      const txBuiderAnyInvoke = await getTxBuilder(
        connectedUser,
        xlmToStroop(1).toString(),
        server,
        selectedNetwork.networkPassphrase
      );

      // console.log("transaction has been built", txBuiderAnyInvoke);

      const xdr = await anyInvoke(
        smartWalletContract,
        invokeArgs,
        "contract invocation",
        txBuiderAnyInvoke,
        server
      );

      const signedXdr = await signTransaction(xdr, { network: "FUTURENET" });

      await submitTx(signedXdr, networkPassphrase, server);
      setCreateStatus("");
      processEnd("Account created", e);
      const body = { users: 1 };
      updateStat(body);
    }
  }

  const passwordValid = validatePassword(password, confirmPassword);

  async function handleCreateWithTwitter(e) {
    if (!passwordValid.valid) {
      alert(passwordValid.errors);
      return;
    }

    if (twiterAccount === null) {
      alert("You need to re-verify your twitter account");
      localStorage.setItem("withTwitter", "false");
    }

    //=====================================

    setCreateStatusTwitter("Loading Contract...");
    processStart("Loading contract...");

    // const selectedSigner = signerSelect(signers);
    const selectedSigner = await selectSigner();

    // console.log("the selected signer is", selectedSigner);

    const signer = Keypair.fromSecret(selectedSigner.key);

    const wasmFetched = await fetch(wasmFile);
    const loadedWasm = await wasmFetched.arrayBuffer();

    const txBuilderUpload = await getTxBuilder(
      signer.publicKey(),
      xlmToStroop(1).toString(),
      server,
      selectedNetwork.networkPassphrase
    );

    // console.log("created tx", txBuilderUpload);

    const uploadedWasm = await uploadWasmSigner(
      txBuilderUpload,
      loadedWasm,
      signer
    );

    // console.log("the loaded wasm is", uploadedWasm);
    setCreateStatusTwitter("Creating Account...");
    processStart("Creating account...");

    //=====================================

    const encryptionKey = randomKeySelect(encryptionKeys);

    const hashedPassword = await hashEnteredPassword(
      password,
      encryptionKey.index
    );

    // console.log("frontend hash", hashedPassword.hashedPassword);
    // console.log("backend hash", hashPass);

    const enIndex = encryptionKey.index;

    const encryptedIndex = await encryptText(enIndex.toString(), 1);

    const createOperation = "create_account_pkey";
    const executorIndex = selectedSigner.index + 1;
    const platform = "twitter";
    const profile_id = twiterAccount?.twitterId;
    const salt = hashedPassword.encryptedHex;

    const saltIv = hashedPassword.iv;
    const keyIndex = encryptedIndex.encryptedHex;
    const indexIv = encryptedIndex.iv;
    const passkeyHash = hashedPassword.hashedPassword;

    const invokeArgs = [createOperation];
    invokeArgs.push(nativeToScVal(Number(executorIndex), { type: "u32" }));
    invokeArgs.push(nativeToScVal(platform));
    invokeArgs.push(nativeToScVal(profile_id));
    invokeArgs.push(nativeToScVal(salt));
    invokeArgs.push(nativeToScVal(saltIv));
    invokeArgs.push(nativeToScVal(keyIndex));
    invokeArgs.push(nativeToScVal(indexIv));
    invokeArgs.push(nativeToScVal(passkeyHash));

    const allowanceInt = Soroban.parseTokenAmount(maxAllowance.toString(), 7);
    const allowanceScVal = new ScInt(allowanceInt).toI128();
    invokeArgs.push(nativeToScVal(allowanceScVal));
    invokeArgs.push(nativeToScVal(uploadedWasm));

    const txBuilderCreate = await getTxBuilder(
      signer.publicKey(),
      xlmToStroop(1).toString(),
      server,
      selectedNetwork.networkPassphrase
    );

    const contract = new Contract(smartWalletContract);

    const memo = "create smart account";

    const tx = txBuilderCreate
      .addOperation(contract.call(...invokeArgs))
      .setTimeout(TimeoutInfinite);

    if (memo?.length > 0) {
      tx.addMemo(Memo.text(memo));
    }

    const built = tx.build();

    const preparedTransaction = await server.prepareTransaction(built);

    preparedTransaction.sign(signer);
    const sendResponse = await server.sendTransaction(preparedTransaction);
    console.log("the transaction has been signed");
    // console.log(sendResponse);

    if (sendResponse.status === "PENDING") {
      let txResponse = await server.getTransaction(sendResponse.hash);

      // Poll this until the status is not "NOT_FOUND"
      while (
        txResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND
      ) {
        txResponse = await server.getTransaction(sendResponse.hash);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (txResponse.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
        const restx = await server.getTransaction(sendResponse.hash);

        const accountId = StrKey.encodeContract(
          restx.returnValue._value._value
        );
      }
    }

    // console.log("the tx is", sendResponse);
    setCreateStatusTwitter("");
    // localStorage.setItem("withTwitter", "false");
    // setCreateWithTwitter(false);

    localStorage.setItem("login", "false");

    handleTwitterBack();
    // setIsOpen(false);

    processEnd("Account created", e);
    const body = { users: 1 };
    updateStat(body);
  }

  function useTwitterHandler(e) {
    localStorage.setItem("selectedMethod", "twitter");
    setCreateStatusTwitter("Authenticating Twitter...");
    // const twitterAuthUrl = "https://auth-twitter.socket.fi/auth/twitter"; // Your Twitter OAuth URL
    const twitterAuthUrl = "https://twitter.socket.fi/auth/twitter"; // Your Twitter OAuth URL

    // Redirect to the Twitter authentication URL in the same tab
    window.location.href = twitterAuthUrl;

    // console.log("twiter auth is complete");
    localStorage.setItem("login", "true");
    localStorage.setItem("withTwitter", "true");
  }

  // function useTwitterHandler() {
  //   setCreateStatusTwitter("Authenticating Twitter...");
  //   const twitterAuthUrl = "https://auth-twitter.socket.fi/auth/twitter";

  //   // Open a popup window for authentication
  //   const authWindow = window.open(
  //     twitterAuthUrl,
  //     "_blank",
  //     "width=600,height=600"
  //   );

  //   // You can listen for a message from the popup to know when the auth is complete
  //   window.addEventListener("message", (event) => {
  //     if (event.origin === "https://auth-twitter.socket.fi") {
  //       // Handle the token or session data from the auth server
  //       console.log("Authentication result:", event.data);
  //       localStorage.setItem("login", "true");
  //       authWindow.close();
  //     }
  //   });
  // }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center h-full bg-gray-900 bg-opacity-70"
      onClick={onClose}
    >
      {processProgress.message.length > 0 && (
        <ProgressModal processProgress={processProgress}>
          {processProgress.message}
        </ProgressModal>
      )}
      {processProgress.message.length === 0 &&
        (!openCreateWithTwitterModal ? (
          <div
            className="w-full max-w-sm bg-white shadow-lg rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative cursor-pointer"
              role="button"
              onClick={onClose}
            >
              <CloseCircle className="text-gray-900 h-7 w-auto absolute top-2 right-2" />
              {/* Other content here */}
            </div>

            <div className="px-4 py-5 sm:p-6">
              <p className="text-xl font-bold text-gray-900">
                Login or Create an Account
              </p>
              <p className="mt-3 text-sm font-medium text-gray-500">
                Login or create a smart account using your wallet or Twitter
              </p>

              <div className="mt-6">
                <div className="space-y-8">
                  <div className="mt-10">
                    <div className="mt-2">
                      <button
                        className="inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-opacity-90 hover:-translate-y-[2px] "
                        onClick={handleCreateWithWallet}
                      >
                        {createStatus?.length > 0
                          ? createStatus
                          : "Use Freighter Wallet"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="mt-2">
                      <button
                        className="inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-opacity-90 hover:-translate-y-[2px] "
                        onClick={useTwitterHandler}
                      >
                        {createStatusTwitter?.length > 0
                          ? createStatusTwitter
                          : " Use Twitter Account"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-gray-600 mt-6 flex gap-1 items-center">
                  <p>View our privacy terms and conditions</p>{" "}
                  <svg
                    className="w-4 h-4 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center w-full h-full px-4 py-5 sm:p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-sm bg-white shadow-lg rounded-xl">
              <div
                className="relative cursor-pointer"
                role="button"
                onClick={onClose}
              >
                <CloseCircle className="text-gray-900 h-7 w-auto absolute top-2 right-2" />
                {/* Other content here */}
              </div>
              <div className="px-4 py-5 sm:p-6">
                <p className="text-xl font-bold text-gray-900">
                  <span className="text-blue-600">
                    @{twiterAccount?.screenName}
                  </span>{" "}
                  authenticated
                </p>
                <p className="mt-3 text-sm font-medium text-gray-500">
                  Your twitter account has been verified, you can now create
                  your smart wallet account
                </p>

                <div className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-900">
                        {" "}
                        Enter Transaction password
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          name=""
                          id=""
                          placeholder="password"
                          // value={password}
                          className="block w-full px-4 py-3 placeholder-gray-500 border -gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-900">
                        {" "}
                        Confirm Transaction password{" "}
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          type="password"
                          name=""
                          id=""
                          placeholder="password"
                          // value={confirmPassword}
                          className="block w-full px-4 py-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-900">
                        {" "}
                        Max smart allowance
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={(e) => setMaxAllowance(e.target.value)}
                          type="number"
                          name=""
                          id=""
                          placeholder="e.g: 100"
                          value={maxAllowance}
                          className="block w-full px-4 py-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 space-x-4">
                    <button
                      onClick={handleTwitterBack}
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-gray-600 transition-all duration-200 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    >
                      back
                    </button>

                    <button
                      onClick={handleCreateWithTwitter}
                      // type="submit"
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500"
                    >
                      {createStatusTwitter?.length > 0
                        ? createStatusTwitter
                        : "Create Smart Wallet"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
