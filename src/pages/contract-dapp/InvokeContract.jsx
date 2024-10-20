import React, { useEffect, useState } from "react";
import {
  ScInt,
  Soroban,
  StrKey,
  nativeToScVal,
  Address,
  Account,
  MuxedAccount,
  Horizon,
  encodeMuxedAccount,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

import {
  server,
  getTxBuilder,
  FUTURENET_DETAILS,
  mintTokens,
  xlmToStroop,
  submitTx,
  accountToScVal,
  anyInvoke,
  getAccount,
  loadContract,
  BASE_FEE,
  getWalletBalance,
  getContractInfo,
} from "../../utils/soroban";

import {
  Copy,
  AddCircle,
  CloseCircle,
  DocumentCode,
  ElementPlus,
  FolderAdd,
  Receive,
  Send2,
} from "iconsax-react";
import XLMlogo from "../../assets/2024.svg";
import { contracts } from "../../contract";

export default function InvokeContract({
  userKey,
  setUserKey,
  setNetwork,
  isWalletInstalled,
  setLoadedContractId,
  loadedContractId,
  connecting,
  setConnecting,
}) {
  const [selectedToken, setSelectedToken] = useState("");
  const [mintAmount, setMintAmount] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [mintStatus, setMintStatus] = useState("PRE");
  const [argsCount, setArgsCount] = useState([]);
  const [args, setArgs] = useState([]);
  const [operation, setOperation] = useState("");
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const memo = "mint tokens";
  const smartWalletContract =
    "CDLV4F24STUXTCRL2SQMIKQ6AEU5LBZ7S7H5EQISP3ZMH6CGXU4FWHY3";
  const XLMId = "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT";
  const [smartAccount, setSmartAccount] = useState(null);

  const selectedNetwork = FUTURENET_DETAILS;
  const { network, networkPassphrase } = selectedNetwork;
  const [receiveSelected, setReceiveSelected] = useState(true);
  const [recipient, setRecipient] = useState(userKey);
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("");

  // console.log("the args are", args);

  function addArgsHandler() {
    let curCount = argsCount.length;
    const newCount = curCount + 1;
    setArgsCount(() => [...argsCount, newCount]);
    setArgs(() => [...args, { id: newCount, name: "", type: "", value: "" }]);
  }

  function deleteArgsHandler(selectedArg) {
    setFile(null);
    setFileContent(null);
    setArgsCount((prevArgsCount) =>
      prevArgsCount.filter((arg) => arg !== selectedArg)
    );

    setArgs((prevArgs) => prevArgs.filter((arg) => arg.id !== selectedArg));
  }

  function stringToArray(input) {
    if (!!input) {
      return input
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");
    }
    return [];
  }

  function processArgs(arg) {
    if (arg.type === "i128") {
      const quantity = Soroban.parseTokenAmount(arg.value, 7);
      return new ScInt(quantity).toI128();
    } else if (arg.type === "Address") {
      return accountToScVal(arg.value); // to
    } else if (arg.type === "u32") {
      return nativeToScVal(Number(arg.value), { type: "u32" }); // to
    } else if (arg.type === "u64") {
      return nativeToScVal(Number(arg.value)); // to
    } else if (arg.type === "u64") {
      return nativeToScVal(Number(arg.value)); // to
    } else if (arg.type === "symbol") {
      return nativeToScVal(arg.value, { type: "symbol" }); // to
    } else if (arg.type === "Wasm") {
      return;
    } else if (arg.type === "vec") {
      const arrs = stringToArray(arg.value);
      const argsare = nativeToScVal(arrs, {
        type: ["u64", "u64", "symbol"],
      }); // to

      return argsare;
    } else {
      return nativeToScVal(arg.value);
    }
  }

  async function anyInvokeHandler(e) {
    e.preventDefault();
    try {
      setConnecting(() => true);

      let loadedWasm;

      if (fileContent !== null) {
        const txBuilderUpload = await getTxBuilder(
          userKey,
          xlmToStroop(1).toString(),
          server,
          selectedNetwork.networkPassphrase
        );

        const wasm = fileContent;

        const signedXdr = await loadContract(wasm, txBuilderUpload);
        const txHash = await submitTx(signedXdr, networkPassphrase, server);
        loadedWasm = txHash.returnValue._value;
      }

      const invokeArgs = [operation];
      for (const eachArg of args) {
        if (eachArg?.type === "Wasm") {
          invokeArgs.push(nativeToScVal(loadedWasm));
        } else {
          invokeArgs.push(processArgs(eachArg));
        }
      }

      const txBuiderAnyInvoke = await getTxBuilder(
        userKey,
        xlmToStroop(1).toString(),
        server,
        selectedNetwork.networkPassphrase
      );

      const xdr = await anyInvoke(
        loadedContractId,
        invokeArgs,
        "contract invocation",
        txBuiderAnyInvoke,
        server
      );

      const signedXdr = await signTransaction(xdr, { network: "FUTURENET" });

      const result = await submitTx(signedXdr, networkPassphrase, server);
      const contractId = StrKey.encodeContract(
        result.returnValue._value._value
      );
      // console.log("protocol token id is", contractId);
      // console.log("invoke result", result);
    } catch (e) {
      alert(e.message);
    } finally {
      setConnecting(() => false);
    }
  }

  async function loadContractHandler() {
    if (await StrKey.isValidContract(selectedToken)) {
      setLoadedContractId(() => selectedToken);
    }
  }

  const copyHandler = () => {
    navigator.clipboard
      .writeText(loadedContractId)
      .then(() => {
        // console.log("Contract ID copied to clipboard:", loadedContractId);
        // Optionally, show a success message to the user
        alert("Contract ID copied!");
      })
      .catch((err) => {
        // console.error("Failed to copy text to clipboard:", err);
      });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileBuffer = event.target.result;
      setFileContent(() => fileBuffer);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  useEffect(() => {
    async function fetchAccount() {
      const txBuilder = await getTxBuilder(
        userKey,
        BASE_FEE,
        server,
        FUTURENET_DETAILS.networkPassphrase
      );

      const res = await getAccount({
        walletId: smartWalletContract,
        userPubKey: userKey,
        txBuilderAccount: txBuilder,
        server: server,
      });
      setSmartAccount(() => res);
      const contractId = res;

      const txBuilder2 = await getTxBuilder(
        userKey,
        BASE_FEE,
        server,
        FUTURENET_DETAILS.networkPassphrase
      );

      console.log("the contract id is", contractId);

      const contractInfo = await getContractInfo({
        contractId: res,
        arg: "get_tokens",
        txBuilder: txBuilder2,
        server: server,
      });

      console.log("contract info is", contractInfo);
    }

    if (userKey?.length > 0) {
      try {
        fetchAccount();
      } catch (e) {
        console.log("no account found");
      }
    }
  }, [userKey, connecting]);

  const wasmFile = contracts[3]?.wasmfile;
  async function createAccountHandler() {
    console.log("the value of None", nativeToScVal(null));
    console.log("the value of NaN", nativeToScVal(NaN));
    // return;
    setConnecting(() => true);

    const wasmFetched = await fetch(wasmFile);
    const loadedWasmBuffer = await wasmFetched.arrayBuffer();

    const txBuilderUpload = await getTxBuilder(
      userKey,
      xlmToStroop(1).toString(),
      server,
      selectedNetwork.networkPassphrase
    );

    const wasm = loadedWasmBuffer;

    const signedXdrLoad = await loadContract(wasm, txBuilderUpload);

    const txHash = await submitTx(signedXdrLoad, networkPassphrase, server);
    const loadedWasm = txHash.returnValue._value;
    const createOperation = "create_account_with_addr";

    const invokeArgs = [createOperation];
    invokeArgs.push(accountToScVal(userKey));
    invokeArgs.push(nativeToScVal(loadedWasm));

    const txBuiderAnyInvoke = await getTxBuilder(
      userKey,
      xlmToStroop(1).toString(),
      server,
      selectedNetwork.networkPassphrase
    );

    const xdr = await anyInvoke(
      smartWalletContract,
      invokeArgs,
      "contract invocation",
      txBuiderAnyInvoke,
      server
    );

    const signedXdr = await signTransaction(xdr, { network: "FUTURENET" });

    await submitTx(signedXdr, networkPassphrase, server);
    setConnecting(() => false);
  }

  useEffect(() => {
    setRecipient(userKey);
  }, [userKey]);

  function handleRecipientChange(e) {
    setRecipient(e.target.value);
  }

  async function handleTransact() {
    if (amount === 0 || recipient.length === 0 || tokenId.length === 0) {
      return;
    }
    setConnecting(() => true);
    const txBuiderAnyInvoke = await getTxBuilder(
      userKey,
      xlmToStroop(1).toString(),
      server,
      selectedNetwork.networkPassphrase
    );
    const invokeArgs = [];
    if (receiveSelected) {
      invokeArgs.push("receive");
    } else {
      invokeArgs.push("send_auth_addr");
      invokeArgs.push(accountToScVal(userKey));
    }

    const quantity = Soroban.parseTokenAmount(amount, 7);
    const actualAmount = new ScInt(quantity).toI128();

    invokeArgs.push(accountToScVal(recipient));
    invokeArgs.push(accountToScVal(tokenId));
    invokeArgs.push(actualAmount);

    // console.log("this is the args", invokeArgs)

    const xdr = await anyInvoke(
      smartAccount,
      invokeArgs,
      "Transact",
      txBuiderAnyInvoke,
      server
    );

    const signedXdr = await signTransaction(xdr, { network: "FUTURENET" });

    await submitTx(signedXdr, networkPassphrase, server);
    setConnecting(() => false);
  }

  return (
    <div className="overflow-x-hidden bg-gray-100">
      <section className=" bg-gray-100 ">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-5xl mx-auto  space-y-4">
            <div className="mt-6 overflow-hidden  rounded-xl">
              <div className="px-4 py-6 sm:p-8 bg-white mb-3 rounded-xl">
                {smartAccount && (
                  <form
                    method="POST"
                    className="mt-2"
                    onSubmit={loadContractHandler}
                  >
                    <div className="grid grid-cols-1  gap-x-5 gap-y-4">
                      <div>
                        <div className=" p-2 ">
                          <h3 className="text-2xl font-normal  text-gray-900">
                            Your Smart Wallet is:
                          </h3>
                        </div>
                        <div className="mt-2.5 text-xl relative">
                          {smartAccount}
                        </div>
                        <div className="mt-4 text-xl relative">
                          XLM Balance:
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                {loadedContractId.length > 0 && (
                  <>
                    <div className="relative ">
                      <div className="relative p-4 flex  overflow-hidden bg-white justify-between items-center border border-gray-200 rounded-2xl">
                        <div>
                          <div className="flex items-center sm:items-center mb-1">
                            <img
                              src={XLMlogo}
                              className="flex-shrink-0 w-12 h-12 text-gray-400"
                            />
                            <p className="ml-6 text-xl font-bold text-gray-900 text-[24px] font-pj">
                              Loaded contract can now be interated with
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <p className="ml-16 text-xl font-small text-[18px] text-gray-700 font-pj">
                              {loadedContractId}{" "}
                            </p>
                            <button onClick={copyHandler}>
                              <Copy
                                size="16"
                                color="#000000"
                                className="flex-shrink-0 w-auto h-6 text-gray-400"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {loadedContractId?.length > 0 && (
                <>
                  <div>
                    <div className="grid grid-cols-1  gap-x-5 gap-y-4">
                      <div className="px-4 py-4 sm:px-8 bg-white mb-3 rounded-xl">
                        <div className=" p-2 ">
                          <h3 className="text-2xl font-normal  text-gray-900">
                            Operation (function)
                          </h3>
                        </div>
                        <div className="mt-1 relative flex gap-2">
                          <input
                            onChange={(e) => setOperation(e.target.value)}
                            type="text"
                            name=""
                            id=""
                            placeholder="Enter the operation you want to invoke"
                            className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                          />{" "}
                          <div className="sm:col-span-2 flex  rounded-xl items-center w-[220px] justify-between  border border-gray-700 ">
                            <button
                              className="relative flex items-center gap-3   px-4  text-lg font-bold text-white transition-all duration-200 font-pj rounded-xl  justify-between "
                              role="button"
                              onClick={addArgsHandler}
                            >
                              <AddCircle size="44" color="#000000" />{" "}
                              <p className="text-black">Add args</p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {args.length > 0 && (
                    <div>
                      <div className="grid grid-cols-1  gap-x-5 gap-y-4">
                        <div className="px-4 py-4 sm:px-8 bg-white mb-3 rounded-xl">
                          <div className=" p-2 ">
                            <h3 className="text-2xl font-normal  text-gray-900">
                              Arguments
                            </h3>
                          </div>
                          {argsCount?.map((arg, index) => (
                            <div
                              className="mt-1 relative flex gap-2"
                              key={index}
                            >
                              <div className="block px-4 py-4 text-black placeholder-gray-500 w-[200px] transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600">
                                {`Arg${index + 1}`}
                              </div>
                              <div className="">
                                <select
                                  className="block px-4 py-4 h-full text-black placeholder-gray-500 w-[150px] transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                  id="type-select"
                                  value={
                                    args.find((cur) => cur.id === arg)?.type
                                  }
                                  onChange={(e) => {
                                    setArgs(
                                      args.map((cur) =>
                                        cur.id === arg
                                          ? {
                                              ...cur,
                                              name: `Arg${index + 1}`,
                                              type: e.target.value,
                                            }
                                          : cur
                                      )
                                    );
                                  }}
                                >
                                  <option value="select type">
                                    Select type
                                  </option>
                                  <option value="i128">i128</option>
                                  <option value="u32">u32</option>
                                  <option value="u64">u64</option>
                                  <option value="String">String</option>
                                  <option value="symbol">symbol</option>
                                  <option value="Address">Address</option>
                                  <option value="Wasm">{"Wasm"}</option>
                                  <option value="vec">{"vec<u64>"}</option>
                                </select>
                              </div>
                              {args.find((cur) => cur.id === arg)?.type ===
                              "Wasm" ? (
                                // <input
                                //   onChange={(e) => {
                                //     setArgs(
                                //       args.map((cur) =>
                                //         cur.id === arg
                                //           ? { ...cur, value: e.target.value }
                                //           : cur
                                //       )
                                //     );
                                //   }}
                                //   // onChange={(e) => setIvalue(e.target.value)}
                                //   type="text"
                                //   name=""
                                //   id=""
                                //   placeholder="Upload contract file here (.wasm)"
                                //   className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                // />

                                <div className="relative block w-full ">
                                  <div className="relative px-4 py-[7px] flex  overflow-hidden bg-white justify-between items-center border border-gray-200 rounded-md">
                                    <div>
                                      <div className="flex items-center sm:items-center ">
                                        <p className=" text-normal font-bold text-gray-500  font-pj">
                                          {file === null
                                            ? "Upload contract file here (.wasm)"
                                            : `${file?.name} `}
                                        </p>
                                      </div>
                                    </div>

                                    <div className=" flex justify-center bg-[#FF8A65] bg-opacity-25 p-1 rounded-full">
                                      <input
                                        type="file"
                                        accept=".wasm"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                      />
                                      <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer inline-flex items-center  border border-transparent text-base leading-6 font-medium rounded-md  focus:shadow-outline-indigo  transition ease-in-out duration-150"
                                      >
                                        <AddCircle size="32" color="#FF8A65" />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <input
                                  onChange={(e) => {
                                    setArgs(
                                      args.map((cur) =>
                                        cur.id === arg
                                          ? { ...cur, value: e.target.value }
                                          : cur
                                      )
                                    );
                                  }}
                                  // onChange={(e) => setIvalue(e.target.value)}
                                  type="text"
                                  name=""
                                  id=""
                                  placeholder="Argument value"
                                  className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                />
                              )}
                              <div className="sm:col-span-2 flex  rounded-xl items-center justify-between  ">
                                <button
                                  onClick={() => deleteArgsHandler(arg)}
                                  className="relative flex items-center gap-3   px-4  text-lg font-bold text-white transition-all duration-200 font-pj rounded-xl  justify-between "
                                  role="button"
                                >
                                  <CloseCircle size="44" color="#616161" />{" "}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {!smartAccount && (
                <div className="sm:col-span-2">
                  <button
                    disabled
                    // onClick={loadContractHandler}
                    onClick={anyInvokeHandler}
                    // onClick={(e) => setIvalue(e.target.value)}
                    className="relative inline-flex items-center justify-center  w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 opacity-60"
                    role="button"
                  >
                    Login to or Create Smart Wallet using Twitter
                  </button>
                </div>
              )}
              {userKey.length > 0 && !smartAccount && (
                <div className="sm:col-span-2">
                  <button
                    // onClick={loadContractHandler}
                    onClick={createAccountHandler}
                    // onClick={(e) => setIvalue(e.target.value)}
                    className="relative inline-flex items-center mt-4 justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    role="button"
                  >
                    {connecting
                      ? "Processing..."
                      : "Login to or Create Smart Wallet using External Wallet"}
                  </button>
                </div>
              )}

              {smartAccount && (
                <div className="">
                  <div className="max-w-5xl mx-auto mt-4 bg-white sm:mt-4 space-y-4">
                    <div className="gap-4 ">
                      <div className="grid grid-cols-1 gap-6 px-8 text-center md:px-0 md:grid-cols-2">
                        <button
                          className={`px-4 py-2  flex items-center text-center justify-center overflow-hidden  rounded-r-full ${
                            receiveSelected
                              ? "bg-gray-900 text-gray-50"
                              : "bg-white text-gray-900"
                          }`}
                          onClick={() => setReceiveSelected(true)}
                        >
                          {/* <SecuritySafe
                    size="32"
                    color="#555555"
                    className="flex-shrink-0 w-10 h-10 mx-10 text-gray-400"
                  /> */}
                          <Receive
                            size="32"
                            // color="#555555"
                            className={`flex-shrink-0 w-10 h-10 mx-10 ${
                              receiveSelected ? "text-gray-50" : "text-gray-900"
                            }`}
                          />
                          <p className=" text-lg font-medium ">
                            Receive Tokens
                          </p>
                        </button>

                        <button
                          className={`px-4 py-2  flex items-center text-center justify-center overflow-hidden  rounded-l-full ${
                            !receiveSelected
                              ? "bg-gray-900 text-gray-50"
                              : "bg-white  text-gray-900 "
                          }`}
                          onClick={() => setReceiveSelected(false)}
                        >
                          <Send2
                            size="32"
                            // color="#555555"
                            className={`flex-shrink-0 w-10 h-10 mx-10 ${
                              !receiveSelected
                                ? "text-gray-50"
                                : "text-gray-900"
                            }`}
                          />
                          <p className=" text-lg font-medium leading-relaxed ">
                            Send Tokens
                          </p>
                        </button>
                      </div>
                    </div>
                    {receiveSelected && (
                      <div className="">
                        <div className="pt-4 px-6">
                          {" "}
                          <p>
                            Send tokens from an external wallet to a your smart
                            wallet. The above smart wallet will be credited
                          </p>
                        </div>

                        <div className="mt-1 relative flex gap-2 px-6 py-2 ">
                          <div className="block w-full">
                            <div className="block py-4 text-black text-lg font-bold placeholder-gray-500 w-[200px] transition-all duration-200  rounded-md  caret-blue-600">
                              Token ID:
                            </div>
                            <input
                              onChange={(e) => setTokenId(e.target.value)}
                              type="text"
                              name=""
                              id=""
                              placeholder="Paste token id here"
                              className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                            />
                          </div>

                          <div className="block">
                            <div className="block py-4 text-black text-lg font-bold placeholder-gray-500 w-[200px] transition-all duration-200  rounded-md  caret-blue-600">
                              Amount:
                            </div>
                            <input
                              onChange={(e) => setAmount(e.target.value)}
                              type="text"
                              name=""
                              id=""
                              placeholder="Enter amount"
                              className="block px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {!receiveSelected && (
                      <div className="">
                        <div className="pt-4 px-6">
                          {" "}
                          <p>
                            Send tokens from your smart wallet to an external
                            wallet. Default recipient is the connected wallet
                            but you can change it
                          </p>
                        </div>

                        <div className="mt-1 relative flex gap-2 px-6 py-2 ">
                          <div className="block w-full">
                            <div className="block py-4 text-black text-lg font-bold placeholder-gray-500 w-[200px] transition-all duration-200  rounded-md  caret-blue-600">
                              Token ID:
                            </div>
                            <input
                              onChange={(e) => setTokenId(e.target.value)}
                              type="text"
                              name=""
                              id=""
                              placeholder="Paste token id here"
                              className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                            />
                          </div>

                          <div className="block">
                            <div className="block py-4 text-black text-lg font-bold placeholder-gray-500 w-[200px] transition-all duration-200  rounded-md  caret-blue-600">
                              Amount:
                            </div>
                            <input
                              onChange={(e) => setAmount(e.target.value)}
                              type="text"
                              name=""
                              id=""
                              placeholder="Enter amount"
                              className="block px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                            />
                          </div>
                        </div>
                        <div className="mt-1 relative flex gap-2 px-6 py-2 ">
                          <div className="block w-full">
                            <div className="block py-4 text-black text-lg font-bold placeholder-gray-500 w-[200px] transition-all duration-200  rounded-md  caret-blue-600">
                              Recipient:
                            </div>
                            <input
                              onChange={handleRecipientChange}
                              type="text"
                              name=""
                              id=""
                              value={recipient}
                              placeholder="Paste recipient here"
                              className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      // onClick={loadContractHandler}
                      onClick={handleTransact}
                      // onClick={(e) => setIvalue(e.target.value)}
                      className="relative inline-flex items-center mt-4 justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      role="button"
                    >
                      {connecting ? "Processing..." : "Confirm Transfer"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
