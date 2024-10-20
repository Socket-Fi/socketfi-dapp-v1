import React, { useState } from "react";
import {
  ConnectWallet,
  FUTURENET_DETAILS,
  getAccountKeysProfile,
  getTxBuilder,
  server,
  setAllowance,
  setOwner,
  xlmToStroop,
} from "../../../utils/soroban";
import {
  decryptText,
  reHashEnteredPassword,
  returnPasswordhash,
  selectSigner,
} from "../../../utils/config";
import { Keypair } from "@stellar/stellar-sdk";

export default function UpdateProfile(props) {
  const [selectUpdate, setSelectUpdate] = useState("");
  const [enteredAllowance, setEnteredAllowance] = useState("");
  const [password, setPassword] = useState("");
  const [gAccount, setGAccount] = useState("");
  const [txNetwork, setTxNetwork] = useState("");
  const [connecting, setConnecting] = useState(false);
  const {
    twiterAccount,
    smartAccountIds,
    setProcessProgress,
    setDataUpdate,
    dataUpdate,
    processProgress,
  } = props;

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
  // console.log("the signers are", signers);

  const selectedNetwork = FUTURENET_DETAILS;

  const processStart = (message) => {
    // Run these lines immediately
    setDataUpdate(() => message);

    setProcessProgress((pre) => ({
      ...pre,
      message: message,
      isDone: false,
    }));
  };

  const processEnd = (message) => {
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
      setSelectUpdate("");
    }, 2000);
  };

  async function updateHandler() {
    processStart("Transaction processing...");
    if (selectUpdate === "allowance") {
      processStart("setting allowance...");
      // const selectedSigner = signerSelect(signers);
      const signerSel = await selectSigner();

      const signer = Keypair.fromSecret(signerSel.key);

      const profileId = twiterAccount?.twitterId;

      const txBuilderKeys = await getTxBuilder(
        signer.publicKey(),
        xlmToStroop(1).toString(),
        server,
        selectedNetwork.networkPassphrase
      );

      const accountKeys = await getAccountKeysProfile({
        smartAccountId: smartAccountIds[0].accountId,
        profileId: profileId,
        txBuilderAccount: txBuilderKeys,
        server: server,
      });

      // console.log("account keys", accountKeys);

      const enIndex = await decryptText(
        accountKeys.index_encrypted,
        accountKeys.index_encryption_iv,
        1
      );

      const accountSalt = await decryptText(
        accountKeys.gen_salt_encrypted,
        accountKeys.salt_encryption_iv,
        Number(enIndex)
      );

      const txBuilderAllowance = await getTxBuilder(
        signer.publicKey(),
        xlmToStroop(1).toString(),
        server,
        selectedNetwork.networkPassphrase
      );

      const enteredPasswordHash = await reHashEnteredPassword(
        password,
        accountSalt
      );

      // console.log("entered password hash", enteredPasswordHash.hashedPassword);

      // return;

      const allowanceRes = await setAllowance({
        smartAccountId: smartAccountIds[0].accountId,
        signerIndex: signerSel.index + 1,
        signer: signer,
        enteredPasswordHash: enteredPasswordHash.hashedPassword,
        allowance: enteredAllowance,
        txBuilderAllowance: txBuilderAllowance,
        server: server,
      });
      processEnd("Allowance setting done");
      setEnteredAllowance("");
      setPassword("");
    } else if (selectUpdate === "owner") {
      processStart("setting owner...");

      const signerSel = await selectSigner();

      const signer = Keypair.fromSecret(signerSel.key);

      const profileId = twiterAccount?.twitterId;

      const txBuilderKeys = await getTxBuilder(
        signer.publicKey(),
        xlmToStroop(1).toString(),
        server,
        selectedNetwork.networkPassphrase
      );

      const accountKeys = await getAccountKeysProfile({
        smartAccountId: smartAccountIds[0].accountId,
        profileId: profileId,
        txBuilderAccount: txBuilderKeys,
        server: server,
      });

      // console.log("account keys", accountKeys);

      const enIndex = await decryptText(
        accountKeys.index_encrypted,
        accountKeys.index_encryption_iv,
        1
      );

      const accountSalt = await decryptText(
        accountKeys.gen_salt_encrypted,
        accountKeys.salt_encryption_iv,
        Number(enIndex)
      );

      const txBuilderOwner = await getTxBuilder(
        signer.publicKey(),
        xlmToStroop(1).toString(),
        server,
        selectedNetwork.networkPassphrase
      );

      const enteredPasswordHash = await reHashEnteredPassword(
        password,
        accountSalt
      );

      const ownerRes = await setOwner({
        smartAccountId: smartAccountIds[0].accountId,
        signerIndex: signerSel.index + 1,
        signer: signer,
        enteredPasswordHash: enteredPasswordHash.hashedPassword,
        owner: gAccount,
        txBuilderOwner: txBuilderOwner,
        server: server,
      });

      processEnd("Owner has been set");
      setPassword("");
      setGAccount("");

      // console.log("receive transaction done");
      //   setCreateStatus("");
    }

    // processEnd("Transaction complete");
    // setSelectedToken("");
    // setAmount(null);
  }

  async function handleConnect() {
    setConnecting(true);

    const key = await ConnectWallet(setGAccount, setTxNetwork);
    setGAccount(() => key);
    // console.log("the connected wallet is", key);
    // setConnecting(() => false);
    setConnecting(false);
  }

  return (
    <section className="flex justify-center w-full  border border-gray-200 rounded-xl bg-white h-full px-4 sm:p-6  relative lg:col-span-3 ">
      <div className="w-full ">
        <div className="max-w-xl mx-auto  ">
          <div className="space-y-4 ">
            <div className="px-4 py-5 border border-gray-900  rounded-lg">
              <h3>
                <button
                  className="flex items-center justify-between w-full space-x-6 text-base font-bold text-left text-gray-900"
                  onClick={() =>
                    setSelectUpdate((cur) =>
                      cur === "allowance" ? "" : "allowance"
                    )
                  }
                >
                  <span className="flex-1">Set Account Allowance</span>

                  {selectUpdate === "allowance" && (
                    <span>
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </span>
                  )}
                  {selectUpdate !== "allowance" && (
                    <span aria-hidden="true">
                      <svg
                        className="w-5 h-5 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </h3>

              {selectUpdate === "allowance" && (
                <div className="mt-6 gap-3 flex flex-col">
                  <div className="pt-4 text-base font-medium text-gray-500">
                    The allowance sets the maximum amount a spender can access
                    within your smart account for each transaction made by the
                    spender.
                  </div>
                  <div className="gap-3 flex flex-col">
                    <label className="block text-sm font-bold text-gray-900 sm:mt-px sm:pt-2">
                      {" "}
                      Enter Allowance
                    </label>
                    <div className="mt-2 sm:mt-0 sm:col-span-2">
                      <input
                        onChange={(e) => setEnteredAllowance(e.target.value)}
                        type="number"
                        name=""
                        id=""
                        placeholder="Ex. 1000"
                        value={enteredAllowance}
                        className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="gap-3 flex flex-col">
                    <label className="block text-sm font-bold text-gray-900 sm:mt-px sm:pt-2">
                      {" "}
                      Enter your password
                    </label>
                    <div className="mt-2 sm:mt-0 sm:col-span-2">
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name=""
                        id=""
                        value={password}
                        className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 ">
                    <button
                      onClick={updateHandler}
                      // type="submit"
                      className="inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-md hover:bg-gray-700"
                    >
                      Submit Allowance
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-5 border border-gray-900 rounded-lg">
              <h3>
                <button
                  className="flex items-center justify-between w-full space-x-6 text-base font-bold text-left text-gray-900"
                  onClick={() =>
                    setSelectUpdate((cur) => (cur === "owner" ? "" : "owner"))
                  }
                >
                  <span className="flex-1">Set Owner External Account</span>
                  {selectUpdate === "owner" && (
                    <span>
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </span>
                  )}
                  {selectUpdate !== "owner" && (
                    <span aria-hidden="true">
                      <svg
                        className="w-5 h-5 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </h3>

              {selectUpdate === "owner" && (
                <div className="mt-6 gap-3 flex flex-col">
                  <div className="pt-4 text-base font-medium text-gray-500">
                    This sets the external (G) account that can access your
                    smart account. Note that you should only give access to an
                    external account you own. (This requires confirmation from
                    your external wallet)
                  </div>
                  <div className="gap-3 flex flex-col">
                    <label className="block text-sm font-bold text-gray-900 sm:mt-px sm:pt-2">
                      {" "}
                      Connected Account
                    </label>
                    <div className="mt-2 sm:mt-0 sm:col-span-2">
                      <input
                        disabled
                        type="text"
                        name=""
                        id=""
                        placeholder="GAX..."
                        value={gAccount}
                        className="border block w-full px-2 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="gap-3 flex flex-col">
                    <label className="block text-sm font-bold text-gray-900 sm:mt-px sm:pt-2">
                      {" "}
                      Enter your password
                    </label>
                    <div className="mt-2 sm:mt-0 sm:col-span-2">
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name=""
                        id=""
                        value={password}
                        className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                      />
                    </div>
                  </div>

                  {gAccount.length > 0 ? (
                    <div className="flex items-center justify-between mt-5 ">
                      <button
                        onClick={updateHandler}
                        // type="submit"
                        className="inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-md  hover:bg-gray-700"
                      >
                        Set Owner
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-5 ">
                      <button
                        // type="submit"
                        onClick={handleConnect}
                        className="inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-md  hover:bg-gray-700"
                      >
                        {connecting
                          ? "Connecting wallet..."
                          : "Connect to Freighter Wallet"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
