import {
  ArrowDown,
  ArrowDown2,
  Award,
  BuyCrypto,
  Copy,
  GasStation,
  InfoCircle,
  Rank,
} from "iconsax-react";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Logo from "../assets/socketLogo.svg";
import Icon from "../assets/socketIcon.svg";
import SideNav from "./SideNav";
import Wallet from "../pages/socketfi-wallet/Wallet";
import CreateAccountModal from "../components/CreateAccountModal";
import axios from "axios";
import SendModal from "../components/SendModal";
import ProgressModal from "../components/ProgressModal";
import LoadingModal from "../components/LoadingModal";

export default function Layout({
  children,
  setNetwork,
  setUserKey,
  createStatus,
  setCreateStatus,
  createStatusTwitter,
  setCreateStatusTwitter,
  userKey,
  getUser,
  isSend,
  setIsSend,
  transactionCount,

  twiterAccount,
  setTwitterAccount,
  smartAccountIds,
  createWithTwitter,
  setCreateWithTwitter,
  isUseTwitter,
  setIsUseTwitter,
  isOpen,
  setIsOpen,
  isOpenSend,
  setIsOpenSend,
  signer,
  smartWalletContract,
  setDataUpdate,
  processProgress,
  setProcessProgress,
  smartAccountCreatedWithTwitter,
  isFetching,
  setIsFetching,
  allTokens,
  userPoints,
  smartAllowance,
  sum,
  setSmartAccountIds,
}) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  // console.log("the connected twitter acount is", twiterAccount);
  // console.log("creating with twitter", createWithTwitter);

  function handleCloseSideBar(e) {
    e.stopPropagation();
    setSidebarIsOpen(false);
  }

  function handleOpenSideBar(e) {
    e.stopPropagation();
    setSidebarIsOpen(true);
  }

  function handleOnClose(e) {
    localStorage.setItem("withTwitter", "false");
    e.stopPropagation();

    localStorage.setItem("withTwitter", "false");
    setCreateWithTwitter(false);

    setIsOpen(() => false);
  }

  function handleOnCloseSend() {
    // localStorage.setItem("withTwitter", "false");

    setIsOpenSend(() => false);
  }

  function handleOpenCreateAccount() {
    setIsOpen(() => true);
  }

  function handleUseTwitter() {
    setIsUseTwitter(() => true);
  }

  function handleTwitterBack() {
    setIsUseTwitter(() => false);
  }

  function maskString(str) {
    // Check if string is long enough to mask

    // Extract the first 4 characters
    const firstPart = str.slice(0, 4);

    // Extract the last 4 characters
    const lastPart = str.slice(-4);

    // Combine the parts with '***' in the middle
    return `${firstPart}***${lastPart}`;
  }

  const location = useLocation();

  // useEffect(() => {
  //   async function getTwitterAuth() {
  //     try {
  //       setIsFetching(true);
  //       const res = await axios.get(
  //         "http://localhost:4000/auth/login/success",
  //         {
  //           withCredentials: true, // Include credentials in the request
  //         }
  //       );

  //       setTwitterAccount(() => res.data.user);
  //       // If your server responds with auth information, handle it here
  //       // Example:
  //       // const { token } = res.data;

  //       // setCreateWithTwitter(
  //       //   () => localStorage.getItem("withTwitter") === "true"
  //       // );
  //     } catch (error) {
  //       console.error("Error fetching Twitter auth data:", error);
  //     }
  //   }

  //   getTwitterAuth();
  // }, [location]);

  const copyHandler = () => {
    navigator.clipboard
      .writeText(smartAccountIds[0]?.accountId)
      .then(() => {
        // console.log("Contract ID copied to clipboard:", loadedContractId);
        // Optionally, show a success message to the user
        alert("Smart account ID copied!");
      })
      .catch((err) => {
        // console.error("Failed to copy text to clipboard:", err);
      });
  };

  return (
    // <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <div className="flex flex-col  ">
      {processProgress?.message.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center h-full bg-gray-900 bg-opacity-70"
          onClick={handleOnClose}
        >
          <ProgressModal processProgress={processProgress}>
            {processProgress?.message}
          </ProgressModal>
        </div>
      )}
      <CreateAccountModal
        setSmartAccountIds={setSmartAccountIds}
        smartAccountIds={smartAccountIds}
        onClose={handleOnClose}
        isOpen={isOpen}
        setNetwork={setNetwork}
        setUserKey={setUserKey}
        createStatus={createStatus}
        setCreateStatus={setCreateStatus}
        createStatusTwitter={createStatusTwitter}
        setCreateStatusTwitter={setCreateStatusTwitter}
        userKey={userKey}
        getUser={getUser}
        onUseTwitter={handleUseTwitter}
        isUseTwitter={isUseTwitter}
        handleTwitterBack={handleTwitterBack}
        setCreateWithTwitter={setCreateWithTwitter}
        twiterAccount={twiterAccount}
        setIsOpen={setIsOpen}
        signer={signer}
        smartWalletContract={smartWalletContract}
        setDataUpdate={setDataUpdate}
        processProgress={processProgress}
        setProcessProgress={setProcessProgress}
        smartAccountCreatedWithTwitter={smartAccountCreatedWithTwitter}
        isFetching={isFetching}
        setIsFetching={setIsFetching}
      />

      <SendModal
        smartAllowance={smartAllowance}
        onCloseSend={handleOnCloseSend}
        isOpen={isOpen}
        setNetwork={setNetwork}
        setUserKey={setUserKey}
        createStatus={createStatus}
        setCreateStatus={setCreateStatus}
        createStatusTwitter={createStatusTwitter}
        setCreateStatusTwitter={setCreateStatusTwitter}
        userKey={userKey}
        getUser={getUser}
        onUseTwitter={handleUseTwitter}
        isUseTwitter={isUseTwitter}
        handleTwitterBack={handleTwitterBack}
        setCreateWithTwitter={setCreateWithTwitter}
        twiterAccount={twiterAccount}
        isOpenSend={isOpenSend}
        setIsOpenSend={setIsOpenSend}
        smartAccountIds={smartAccountIds}
        signer={signer}
        smartWalletContract={smartWalletContract}
        setDataUpdate={setDataUpdate}
        processProgress={processProgress}
        setProcessProgress={setProcessProgress}
        allTokens={allTokens}
        isSend={isSend}
        setIsSend={setIsSend}
      />

      {processProgress.message.length === 0 && (
        <LoadingModal isFetching={isFetching} />
      )}

      <div className="flex flex-1">
        <SideNav
          smartAccountIds={smartAccountIds}
          onOpenCreate={handleOpenCreateAccount}
          sidebarIsOpen={sidebarIsOpen}
          onCloseSideBar={handleCloseSideBar}
        />

        <div className="flex flex-col flex-1 overflow-x-hidden ">
          <header className=" border-b border-gray-200 ">
            <div className="px-4 mx-auto">
              <div className="flex items-center justify-between h-16">
                <div className="xl:hidden flex ">
                  <div
                    className="flex items-center -m-2 xl:hidden"
                    onClick={handleOpenSideBar}
                  >
                    <button
                      type="button"
                      className="inline-flex bg-gray-200 items-center justify-center p-2 text-gray-400  rounded-lg hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                    >
                      <svg
                        className="w-6 h-6 items-center justify-center"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M4 12h16M4 18h16"
                        ></path>
                      </svg>
                    </button>
                  </div>

                  <div className="flex ml-6 xl:ml-0">
                    <div className="flex items-center flex-shrink-0">
                      <img
                        className="block w-auto h-10 lg:hidden"
                        src={Icon}
                        alt=""
                      />
                      <img
                        className="hidden w-auto h-10 lg:block"
                        src={Logo}
                        alt=""
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 hidden max-w-xs ml-40 mr-auto lg:block">
                  <label className="sr-only"> Search </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>

                    <input
                      type="search"
                      name=""
                      id=""
                      className="block w-full py-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                      placeholder="Search for a token..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end ml-auto space-x-6">
                  <div className="relative">
                    <button
                      type="button"
                      className="p-1 text-gray-700 transition-all duration-200 bg-white rounded-full hover:text-gray-900 focus:outline-none hover:bg-gray-100"
                    >
                      <GasStation size="24" className="text-gray-700" />
                    </button>
                    <span className="inline-flex items-center px-1.5 absolute -top-px -right-1 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white">
                      {" "}
                      2{" "}
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      className="p-1 text-gray-700 transition-all duration-200 bg-white rounded-full hover:text-gray-900 focus:outline-none hover:bg-gray-100"
                    >
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        ></path>
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                  >
                    <img
                      className="object-cover bg-gray-300 rounded-full w-9 h-9"
                      src={twiterAccount?.profileImageUrl}
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main>
            <div className="py-6 ">
              {smartAccountIds[0]?.accountId.length > 0 && (
                <div className="px-4 mx-auto sm:px-6 md:px-8 flex gap-4">
                  <div className="md:items-center md:flex">
                    <p className="text-base font-bold text-gray-900">Owner:</p>
                    <p className="mt-1 text-base font-medium text-gray-500 md:mt-0 md:ml-2">
                      {smartAccountIds[0]?.owner === userKey
                        ? maskString(smartAccountIds[0]?.owner)
                        : smartAccountIds[0]?.owner}
                    </p>
                  </div>
                  <div className="md:items-center md:flex">
                    <p className="text-base font-bold text-gray-900">
                      Account ID:
                    </p>
                    <p className="mt-1 text-base font-medium text-gray-500 md:mt-0 md:ml-2 mr-2">
                      {smartAccountIds[0]?.accountId}
                    </p>
                    <button onClick={copyHandler}>
                      <Copy className="h-5 w-auto text-gray-700" />
                    </button>
                  </div>
                </div>
              )}

              <div className="px-4 mx-auto mt-8 sm:px-6 md:px-8 ">
                <div className="space-y-5 sm:space-y-6 ">
                  <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white border border-gray-200 rounded-xl">
                      <div className="px-5 py-4">
                        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Smart Balance
                        </p>
                        {sum > 0 && (
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xl font-bold text-gray-900">
                              ${(sum * 0.1).toFixed(2)}
                            </p>

                            <span className="inline-flex items-center text-sm font-semibold text-green-500">
                              + 36%
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 ml-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                                ></path>
                              </svg>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl">
                      <div className="px-5 py-4">
                        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Transaction Vol
                        </p>

                        {sum > 0 && (
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xl font-bold text-gray-900">
                              ${(sum * 0.1).toFixed(2)}
                            </p>

                            <span className="inline-flex items-center text-sm font-semibold text-red-500">
                              - 14%
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 ml-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17 13l-5 5m0 0l-5-5m5 5V6"
                                />
                              </svg>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl">
                      <div className="px-5 py-4">
                        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                          No. of Transactions
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xl font-bold text-gray-900">
                            {transactionCount}
                          </p>

                          {transactionCount && (
                            <span className="inline-flex items-center text-sm font-semibold text-green-500">
                              + 36%
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 ml-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                                ></path>
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl">
                      <div className="px-5 py-4">
                        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Loyalty Points
                        </p>
                        {userPoints?.points > 0 && (
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xl font-bold text-gray-900">
                              {userPoints?.points} XP
                            </p>

                            <span className="inline-flex items-center text-base font-semibold text-green-700 gap-1  justify-center">
                              <Rank className="text-green-700 h-5 w-auto" />
                              <p> 15</p>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
