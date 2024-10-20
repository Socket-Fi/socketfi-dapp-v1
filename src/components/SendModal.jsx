import { CloseCircle, Copy } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { signTransaction, requestAccess } from "@stellar/freighter-api";

import { ScInt, Soroban, nativeToScVal, Keypair } from "@stellar/stellar-sdk";
import {
  server,
  getTxBuilder,
  FUTURENET_DETAILS,
  xlmToStroop,
  submitTx,
  accountToScVal,
  anyInvoke,
  ConnectWallet,
  getAccountKeysProfile,
  setNones,
  getSerialNonce,
  sendTokensPasskey,
  getContractInfo,
} from "../utils/soroban";
import { contracts } from "../contract";
import {
  returnPasswordhash,
  decrypt,
  signerSelect,
  selectSigner,
  decryptText,
  reHashEnteredPassword,
  updateStat,
  updateUserHistory,
} from "../utils/config";
import ProgressModal from "./ProgressModal";
import SelectToken from "./SelectToken";
import SelectReceiveToken from "./SelectReceiveToken";
import contractIds from "../utils/contract-ids.json";

export default function SendModal({
  isOpenSend,
  onCloseSend,
  setUserKey,
  setNetwork,
  createStatus,
  setCreateStatus,
  createStatusTwitter,
  setCreateStatusTwitter,
  userKey,
  getUser,
  setDataUpdate,
  twiterAccount,
  smartAccountIds,
  smartWalletContract,
  processProgress,
  setProcessProgress,
  allTokens,
  isSend,
  setIsSend,
  smartAllowance,
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
  //   const signers = VITE_SECRET ? VITE_SECRET.split("#") : [];

  const whitelistedTokens = contractIds.TOKENS.FUTURENET;

  const selectedNetwork = FUTURENET_DETAILS;
  const { network, networkPassphrase } = selectedNetwork;
  const [password, setPassword] = useState("");

  const [gAccount, setGAccount] = useState("");
  const [amount, setAmount] = useState(null);
  const [txToken, setTxToken] = useState("");
  const [tokenReceive, setTokenReceive] = useState(whitelistedTokens[0]);
  const [txNetwork, setTxNetwork] = useState("");
  const [selectedToken, setSelectedToken] = useState("");

  if (!isOpenSend) return null; // Don't render the modal if it's not open
  if (processProgress.message.length > 0) return null;

  // console.log("twitter auth status", createStatusTwitter);

  async function handleConnect() {
    // setConnecting(() => true);
    const key = await ConnectWallet(setGAccount, setTxNetwork);
    setGAccount(() => key);
    // console.log("the connected wallet is", key);
    // setConnecting(() => false);
  }

  const maxHandler = () => {
    const selectedBal = selectedToken?.balance;
    setAmount(() => selectedBal.toString());
  };

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
      onCloseSend();
    }, 2000);
  };

  async function handleSendWithWallet() {
    const sendOperation = "send_auth_addr";

    const tokenId = selectedToken?.token_id;

    const invokeArgs = [sendOperation];
    invokeArgs.push(accountToScVal(gAccount));
    invokeArgs.push(accountToScVal(tokenId));

    const quantity = Soroban.parseTokenAmount(amount, 7);
    const quantitySc = new ScInt(quantity).toI128();
    invokeArgs.push(nativeToScVal(quantitySc));
    // console.log(gAccount, tokenId, quantity);
    // console.log(invokeArgs);
    // return;
    // console.log("the args are", invokeArgs);
    // console.log("the args are", gAccount, tokenId, quantity);
    // // return;

    const txBuiderAnyInvoke = await getTxBuilder(
      gAccount,
      xlmToStroop(1).toString(),
      server,
      selectedNetwork.networkPassphrase
    );

    const xdr = await anyInvoke(
      smartAccountIds[0].accountId,
      invokeArgs,
      "contract invocation",
      txBuiderAnyInvoke,
      server
    );

    const signedXdr = await signTransaction(xdr, { network: "FUTURENET" });

    const res = await submitTx(signedXdr, networkPassphrase, server);

    // sample body:
    // body= { transactionId: '', status: '', type: '', recipient: '', date: ''}

    const body = {
      transactionId: "",
      status: res?.status,
      type: "send",
      tokenId: selectedToken?.token_id,
      symbol: selectedToken?.symbol,
      amount: amount.toString(),
      value: (Number(amount) * 0.1).toString(),
      recipient: gAccount,
      date: res?.createdAt,
    };

    updateUserHistory(smartAccountIds[0].accountId, body);
  }

  async function handleSendReceive() {
    // setDataUpdate("processing");
    // setProcessProgress("Processing");

    if (isSend) {
      if (smartAccountIds[0]?.owner === userKey) {
        processStart("Transaction processing...");
        await handleSendWithWallet();
      } else {
        if (Number(amount) > Number(smartAllowance)) {
          alert("The amount cannot be greater than your allowance");

          return;
        }
        processStart("Transaction processing...");
        if (!twiterAccount === null) {
          alert("You need to re-verify your twitter account");
          localStorage.setItem("withTwitter", "false");
        }

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

        const txBuilderNonce = await getTxBuilder(
          signer.publicKey(),
          xlmToStroop(1).toString(),
          server,
          selectedNetwork.networkPassphrase
        );

        const enteredPasswordHash = await reHashEnteredPassword(
          password,
          accountSalt
        );

        const res = await setNones({
          smartAccountId: smartAccountIds[0].accountId,
          signerIndex: signerSel.index + 1,
          signer: signer,
          enteredPasswordHash: enteredPasswordHash.hashedPassword,
          spender: gAccount,
          token: selectedToken?.token_id,
          amount: amount,
          txBuilderNonce: txBuilderNonce,
          server: server,
        });

        // console.log("it is fine here 1");

        const txBuilderSendTokens = await getTxBuilder(
          signer.publicKey(),
          xlmToStroop(1).toString(),
          server,
          selectedNetwork.networkPassphrase
        );

        // console.log("it is fine here 1");

        // console.log("the sent transaction built", txBuilderSendTokens);

        const resSend = await sendTokensPasskey({
          walletId: smartWalletContract,
          signer: signer,
          txBuilderSend: txBuilderSendTokens,
          server: server,
          signerIndex: signerSel.index + 1,
          profileId: profileId,
          enteredPasswordHash: enteredPasswordHash.hashedPassword,
          to: gAccount,
          token: selectedToken?.token_id,
          amount: amount,
        });
        const body = {
          transactionId: "",
          status: resSend?.status,
          type: "send",
          tokenId: selectedToken?.token_id,
          symbol: selectedToken?.symbol,
          amount: amount.toString(),
          value: (Number(amount) * 0.1).toString(),
          recipient: gAccount,
          date: resSend?.createdAt,
        };

        updateUserHistory(smartAccountIds[0].accountId, body);

        console.log("the transaction response is", resSend);
      }
      const body = { transactions: 1, assetValue: -amount * 0.1 };

      updateStat(body);
    } else {
      processStart("Transaction processing...");
      const receiveOperation = "receive";

      const tokenId =
        tokenReceive === "custom" ? txToken : tokenReceive.address;

      const invokeArgs = [receiveOperation];
      invokeArgs.push(accountToScVal(gAccount));
      invokeArgs.push(accountToScVal(tokenId));

      const quantity = Soroban.parseTokenAmount(amount, 7);
      const quantitySc = new ScInt(quantity).toI128();
      invokeArgs.push(nativeToScVal(quantitySc));
      // console.log(gAccount, tokenId, quantity);
      // console.log(invokeArgs);
      // return;
      // console.log("the args are", invokeArgs);
      // console.log("the args are", gAccount, tokenId, quantity);
      // // return;

      const txBuiderAnyInvoke = await getTxBuilder(
        gAccount,
        xlmToStroop(1).toString(),
        server,
        selectedNetwork.networkPassphrase
      );

      const xdr = await anyInvoke(
        smartAccountIds[0].accountId,
        invokeArgs,
        "contract invocation",
        txBuiderAnyInvoke,
        server
      );

      const signedXdr = await signTransaction(xdr, { network: "FUTURENET" });

      const res = await submitTx(signedXdr, networkPassphrase, server);

      const txBuilderSymbol = await getTxBuilder(
        gAccount,
        xlmToStroop(1).toString(),
        server,
        selectedNetwork.networkPassphrase
      );

      const tokenSymbol = await getContractInfo({
        contractId: tokenId,
        arg: "symbol",
        txBuilder: txBuilderSymbol,
        server: server,
      });

      // console.log("the token symbol is", tokenSymbol);
      // formatedTokens.push({
      //   balance: stroopToXlm(token.balance).c.at(0),
      //   symbol: tokenSymbol === "native" ? "XLM" : tokenSymbol,
      //   token_id: token.token_id,
      // });

      const body2 = {
        transactionId: "",
        status: res?.status,
        type: "receive",
        tokenId: selectedToken?.token_id,
        symbol: tokenSymbol === "native" ? "XLM" : tokenSymbol,
        amount: amount.toString(),
        value: (Number(amount) * 0.1).toString(),
        recipient: gAccount,
        date: res?.createdAt,
      };

      updateUserHistory(smartAccountIds[0].accountId, body2);

      const body = { transactions: 1, assetValue: amount * 0.1 };

      updateStat(body);
    }

    processEnd("Transaction complete");
    setSelectedToken("");
    setAmount(null);
  }

  const copyHandler = () => {
    navigator.clipboard
      .writeText(selectedToken?.token_id)
      .then(() => {
        // console.log("Contract ID copied to clipboard:", loadedContractId);
        // Optionally, show a success message to the user
        alert("Contract ID copied!");
      })
      .catch((err) => {
        // console.error("Failed to copy text to clipboard:", err);
      });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center h-full bg-gray-900 bg-opacity-70"
      onClick={onCloseSend}
    >
      <div
        className="flex items-center justify-center w-full h-full px-4 py-5 sm:p-6 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-[580px] bg-white shadow-lg rounded-xl">
          <div
            className="relative cursor-pointer"
            role="button"
            onClick={onCloseSend}
          >
            <CloseCircle className="text-gray-900 h-7 w-auto absolute top-2 right-2" />
            {/* Other content here */}
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center gap-16">
              <div className="">
                {" "}
                <button
                  onClick={() => setIsSend(true)}
                  className={`px-4 pt-2 pb-1 ${
                    isSend && "text-indigo-600"
                  }  text-lg`}
                >
                  Send
                </button>
                <hr
                  className={`${
                    isSend ? "border-indigo-600" : "border-white"
                  }  border-[2px] rounded-full`}
                />
              </div>
              <div className="">
                <button
                  onClick={() => setIsSend(false)}
                  className={`px-4 pt-2 pb-1 ${
                    !isSend && "text-indigo-600"
                  }  text-lg`}
                >
                  Receive
                </button>
                <hr
                  className={`${
                    !isSend ? "border-indigo-600" : "border-white"
                  }  border-[2px] rounded-full`}
                />
              </div>
            </div>

            {isSend ? (
              <>
                {" "}
                <p className="mt-3 text-sm font-medium text-gray-500">
                  Send tokens from your smart account to a smart account or an
                  external wallet.
                </p>
                <div className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-900">
                        {" "}
                        Send from{" "}
                        <span className="font-normal">(Smart account)</span>
                      </label>
                      <div className="mt-2">
                        <input
                          //   onChange={(e) => setPassword(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          placeholder="smart account"
                          value={smartAccountIds[0]?.accountId}
                          className="block w-full px-2 py-3 placeholder-gray-500 border -gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 text-[0.85rem] caret-indigo-600"
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-900">
                        {" "}
                        Send to{" "}
                        <span className="font-normal">
                          (Another smart account or G account)
                        </span>
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={(e) => setGAccount(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          placeholder="smart account or G account"
                          // value={confirmPassword}
                          className="block w-full px-2 py-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 text-[0.85rem] caret-indigo-600"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between ">
                        <label className="text-sm font-bold py-1 text-gray-900">
                          {" "}
                          Token
                        </label>

                        {selectedToken && (
                          <div className="relative group ">
                            <button
                              className="focus:outline-none "
                              onClick={copyHandler}
                            >
                              <Copy size="20" className="text-gray-500" />
                            </button>

                            {/* Tooltip text */}
                            <span className="absolute w-[150px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-md px-2 py-1">
                              Copy token contract ID
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex justify-between items-center ">
                        <SelectToken
                          allTokens={allTokens}
                          selectedToken={selectedToken}
                          setSelectedToken={setSelectedToken}
                        />

                        <div className=" px-2 py-3 gap-3 flex items-center  rounded-lg text-[0.85rem]">
                          {selectedToken && "Balance:"}{" "}
                          <span className="font-bold text-lg">
                            {selectedToken?.balance} {selectedToken?.symbol}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        {" "}
                        <label className="text-sm font-bold text-gray-900 ">
                          {" "}
                          Amount
                        </label>
                        {selectedToken && (
                          <button
                            className=" px-2 py-1 text-xs "
                            onClick={maxHandler}
                          >
                            MAX
                          </button>
                        )}
                      </div>

                      <div className="mt-2">
                        <input
                          onChange={(e) => setAmount(e.target.value)}
                          type="number"
                          name=""
                          id=""
                          placeholder="e.g: 100"
                          value={amount}
                          className="block w-full px-4 py-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                        />
                      </div>
                    </div>

                    {smartAccountIds[0]?.owner !== userKey && (
                      <div>
                        <label className="text-sm font-bold text-gray-900">
                          {" "}
                          Transaction password
                        </label>
                        <div className="mt-2">
                          <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            name=""
                            id=""
                            placeholder="Enter password"
                            value={password}
                            className="block w-full px-4 py-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-5 ">
                    <button
                      onClick={handleSendReceive}
                      // type="submit"
                      className="inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500"
                    >
                      {createStatusTwitter?.length > 0
                        ? createStatusTwitter
                        : "Confirm Transaction"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {" "}
                <p className="mt-3 text-sm font-medium text-gray-500">
                  Receive tokens from any external (G account) into your smart
                  account wallet
                </p>
                <div className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-900">
                        {" "}
                        Receive to{" "}
                        <span className="font-normal">(Smart account )</span>
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          placeholder="smart account"
                          value={smartAccountIds[0]?.accountId}
                          className="block w-full px-2 py-3 placeholder-gray-500 border -gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 text-[0.85rem] caret-indigo-600"
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-900">
                        {" "}
                        Receive from{" "}
                        <span className="font-normal">
                          (the connected G account)
                        </span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name=""
                          id=""
                          placeholder="smart account or G account"
                          value={gAccount}
                          className="block w-full px-2  py-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 text-[0.85rem] caret-indigo-600"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between ">
                        <label className="text-sm font-bold py-1 text-gray-900">
                          {" "}
                          Token
                        </label>

                        {selectedToken && (
                          <div className="relative group ">
                            <button
                              className="focus:outline-none "
                              onClick={copyHandler}
                            >
                              <Copy size="20" className="text-gray-500" />
                            </button>

                            {/* Tooltip text */}
                            <span className="absolute w-[150px] left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-md px-2 py-1">
                              Copy token contract ID
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex justify-between items-center ">
                        <SelectReceiveToken
                          allTokens={allTokens}
                          selectedToken={selectedToken}
                          setSelectedToken={setSelectedToken}
                          whitelistedTokens={whitelistedTokens}
                          tokenReceive={tokenReceive}
                          setTokenReceive={setTokenReceive}
                        />

                        <div className=" px-2 py-3 gap-3 flex items-center  rounded-lg text-[0.85rem]">
                          {selectedToken && "Balance:"}{" "}
                          <span className="font-bold text-lg">
                            {selectedToken?.balance} {selectedToken?.symbol}
                          </span>
                        </div>
                      </div>
                    </div>

                    {tokenReceive === "custom" && (
                      <div>
                        <label className="text-sm font-bold text-gray-900">
                          {" "}
                          Token ID
                        </label>
                        <div className="mt-2">
                          <input
                            onChange={(e) => setTxToken(e.target.value)}
                            type="text"
                            name=""
                            id=""
                            placeholder="CA..."
                            value={txToken}
                            className="block w-full px-2 py-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 text-[0.85rem] caret-indigo-600"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-bold text-gray-900">
                        {" "}
                        Amount
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={(e) => setAmount(e.target.value)}
                          type="number"
                          name=""
                          id=""
                          placeholder="e.g: 100"
                          value={amount}
                          className="block w-full px-2 py-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                        />
                      </div>
                    </div>
                  </div>

                  {gAccount.length > 0 ? (
                    <div className="flex items-center justify-between mt-5 ">
                      <button
                        onClick={handleSendReceive}
                        // type="submit"
                        className="inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500"
                      >
                        {createStatusTwitter?.length > 0
                          ? createStatusTwitter
                          : "Confirm Transaction"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-5 ">
                      <button
                        onClick={handleConnect}
                        // type="submit"
                        className="inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500"
                      >
                        Connect using Freighter
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
