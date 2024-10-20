import React, { useState } from "react";
import { StrKey, Address } from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

import {
  server,
  getTxBuilder,
  FUTURENET_DETAILS,
  BASE_FEE,
  submitTx,
  loadContract,
  createContract,
} from "../../utils/soroban";

import {
  BuyCrypto,
  SecuritySafe,
  People,
  CodeCircle,
  DocumentCode,
  AddCircle,
  CommandSquare,
  Copy,
} from "iconsax-react";

import XLMlogo from "../../assets/2024.svg";
import { contracts } from "../../contract";

export default function DeployContract({
  userKey,
  setLoadedContractId,
  setDeploySelected,
  connecting,
  setConnecting,
}) {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [contractAddr, setContractAddr] = useState("");
  const [templateIndex, setTemplateIndex] = useState(null);

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

  async function loadContractHandler() {
    if (await StrKey.isValidContract(contractAddr)) {
      setLoadedContractId(() => contractAddr);

      setDeploySelected(() => false);
    }
  }
  // console.log("contract libraries", contracts);
  const selectedNetwork = FUTURENET_DETAILS;
  const { network, networkPassphrase } = selectedNetwork;

  const copyHandler = () => {
    navigator.clipboard
      .writeText(contractAddr)
      .then(() => {
        // console.log("Contract ID copied to clipboard:", loadedContractId);
        // Optionally, show a success message to the user
        alert("Contract ID copied!");
      })
      .catch((err) => {
        // console.error("Failed to copy text to clipboard:", err);
      });
  };

  async function handleCreateContract(e) {
    e.preventDefault();

    try {
      setConnecting(() => true);
      const txBuilderUpload = await getTxBuilder(
        userKey,
        BASE_FEE,
        server,
        selectedNetwork.networkPassphrase
      );

      const wasm = fileContent;

      const signedXdr = await loadContract(wasm, txBuilderUpload);
      const txHash = await submitTx(signedXdr, networkPassphrase, server);
      const loadedWasmHash = txHash.returnValue._value;

      //   console.log("returned xdr", loadedWasmHash);

      const senderAddr = new Address(userKey);

      const txBuilderCreate = await getTxBuilder(
        userKey,
        BASE_FEE,
        server,
        selectedNetwork.networkPassphrase
      );

      const signedXdr2 = await createContract(
        senderAddr,
        loadedWasmHash,
        txBuilderCreate
      );

      const txHash2 = await submitTx(signedXdr2, networkPassphrase, server);
      // const resttt = xdr.TransactionMeta.fromXDR(txHash2.resultMetaXdr);

      const contractId = StrKey.encodeContract(
        txHash2.returnValue._value._value
      );

      setContractAddr(() => contractId);
    } catch (e) {
      alert(e.message);
    } finally {
      setConnecting(() => false);
    }
  }

  async function templateSelectHandler(index) {
    const file = contracts[index]?.wasmfile;

    const response = await fetch(file);
    const bytes = await response.arrayBuffer();
    setFileContent(() => bytes);
    setTemplateIndex(() => index);
    setFile(() => null);
  }

  // async function templateSelectHandler(index) {
  //   try {
  //     const file = contracts[index]?.wasmfile;
  //     if (!file) {
  //       throw new Error("WASM file not found for the selected index.");
  //     }

  //     const response = await fetch(file);
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch file: ${response.statusText}`);
  //     }

  //     const blob = await response.blob();
  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       const arrayBuffer = reader.result;
  //       setFileContent(arrayBuffer);
  //       setTemplateIndex(index);
  //     };

  //     reader.onerror = () => {
  //       throw new Error("Error reading the file");
  //     };

  //     reader.readAsArrayBuffer(blob);
  //   } catch (error) {
  //     console.error("Error in templateSelectHandler:", error);
  //   }
  // }

  const handleCodeLinkRedirect = (index) => {
    window.open(`${contracts[index].codeLink}`, "_blank");
  };

  return (
    <div className="overflow-x-hidden bg-gray-100">
      <section className=" bg-gray-100 ">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-5xl mx-auto  space-y-4">
            {/* <div className="grid grid-cols-1 gap-6 px-8 text-center md:px-0 md:grid-cols-2">
              <Library />
            </div> */}
            <div className="gap-4 mt-4 mb-8 ">
              <div className=" p-2 pl-4">
                <h3 className="text-2xl font-normal  text-gray-900">
                  Select from contract library
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-2 px-8  md:px-0 md:grid-cols-3">
                {contracts.map((contract, index) => (
                  <button
                    className={`relative border border-gray-200 rounded-2xl  ${
                      templateIndex === index ? "bg-gray-400" : "bg-white"
                    }`}
                    key={index}
                    onClick={() => templateSelectHandler(index)}
                  >
                    <div className="relative p-4 overflow-hidden  ">
                      <div className="flex items-start sm:items-center mb-1">
                        <img
                          src={XLMlogo}
                          className="flex-shrink-0 w-12 h-12 text-gray-400"
                        />

                        <p className="ml-6 text-xl font-bold text-gray-900 text-[24px] font-pj">
                          {contract.title}
                        </p>
                      </div>
                      <p className="ml-4 text-xl font-small text-[14px] text-gray-700  font-pj">
                        {contract.description}
                      </p>
                      <a
                        className="p-1 bg-gray-100 absolute -right-1 -bottom-1 rounded-full z-500 "
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCodeLinkRedirect(index);
                        }}
                      >
                        <CodeCircle
                          size="32"
                          color="#555555"
                          className="z-10"
                        />
                      </a>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className=" p-0 pl-4">
              <h3 className="text-2xl font-normal  text-gray-900">
                Upload contract build
              </h3>
            </div>

            <div className="relative mb-8">
              <div className="relative p-4 flex  overflow-hidden bg-white justify-between items-center border border-gray-200 rounded-2xl">
                <div>
                  <div className="flex items-center sm:items-center mb-1">
                    <DocumentCode
                      size="32"
                      color="#000000"
                      className="flex-shrink-0 w-10 h-10 text-gray-400"
                    />
                    <p className="ml-6 text-xl font-bold text-gray-900 text-[24px] font-pj">
                      Upload contract file here (.wasm)
                    </p>
                  </div>
                  <p className="ml-16 text-xl font-small text-[14px] text-gray-700 font-pj">
                    {file
                      ? `Selected file: ${file.name}`
                      : "Upload the build of the soroban contract you want to deploy here"}
                  </p>
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
                    <AddCircle size="56" color="#FF8A65" />
                  </label>
                </div>
              </div>
            </div>

            {contractAddr.length > 0 && (
              <div className="relative mb-8">
                <div className="relative p-4 flex  overflow-hidden bg-white justify-between items-center border border-gray-200 rounded-2xl">
                  <div>
                    <div className="flex items-center sm:items-center mb-1">
                      <img
                        src={XLMlogo}
                        className="flex-shrink-0 w-12 h-12 text-gray-400"
                      />
                      <p className="ml-6 text-xl font-bold text-gray-900 text-[24px] font-pj">
                        Contract Created 🎊🥳
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <p className="ml-16 text-xl font-small text-[14px] text-gray-700 font-pj">
                        Contract Id: {contractAddr}{" "}
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

                  <button
                    className=" flex justify-center bg-[#FF8A65] bg-opacity-25 p-2 rounded-full"
                    onClick={loadContractHandler}
                  >
                    <CommandSquare size="50" color="#FF8A65" />
                  </button>
                </div>
              </div>
            )}

            {userKey?.length > 0 && (
              <>
                <div className="sm:col-span-2">
                  <button
                    onClick={handleCreateContract}
                    className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    role="button"
                  >
                    {connecting ? "Processing..." : "Create contract"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
