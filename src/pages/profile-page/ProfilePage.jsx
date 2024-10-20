import React, { useState } from "react";

import {
  ArrowDown,
  ArrowDown2,
  Award,
  BuyCrypto,
  GasStation,
  InfoCircle,
} from "iconsax-react";

import ProfileDetail from "./component/ProfileDetail";
import UpdateProfile from "./component/UpdateProfile";
import TransactionHistory from "../../components/TransactionHistory";

export default function ProfilePage({
  allTokens,
  onOpenSend,
  twiterAccount,
  setIsSend,
  setIsOpen,
  smartAccountIds,
  isFetching,
  sum,

  smartAllowance,
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
  dataUpdate,

  smartWalletContract,
  processProgress,
  setProcessProgress,
  smartOwner,

  isSend,
}) {
  // console.log("thes are the tokens", allTokens);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-7">
        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl lg:col-span-4 relative ">
          <ProfileDetail
            twiterAccount={twiterAccount}
            smartAccountIds={smartAccountIds}
            smartAllowance={smartAllowance}
            smartOwner={smartOwner}
            dataUpdate={dataUpdate}
            setDataUpdate={setDataUpdate}
            processProgress={processProgress}
            setProcessProgress={setProcessProgress}
          />
        </div>
        <UpdateProfile
          twiterAccount={twiterAccount}
          smartAccountIds={smartAccountIds}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
          processProgress={processProgress}
          setProcessProgress={setProcessProgress}
        />

        {/* <UpdateProfileBanner
          onCloseSend={onCloseSend}
          setUserKey={setUserKey}
          setNetwork={setNetwork}
          createStatus={createStatus}
          setCreateStatus={setCreateStatus}
          createStatusTwitter={createStatusTwitter}
          setCreateStatusTwitter={setCreateStatusTwitter}
          userKey={userKey}
          getUser={getUser}
          setDataUpdate={setDataUpdate}
          twiterAccount={twiterAccount}
          smartAccountIds={smartAccountIds}
          smartWalletContract={smartWalletContract}
          processProgress={processProgress}
          setProcessProgress={setProcessProgress}
          allTokens={allTokens}
          isSend={isSend}
          setIsSend={setIsSend}
        /> */}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-6">
        <TransactionHistory />
        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl lg:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <div>
              <p className="text-base font-bold text-gray-900">
                Quests & Rewards Hub
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Join, participate and engage in web3 projects and earn loyalty
                points, rewards and airdrops
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between space-x-5">
                <div className="flex items-center flex-1 min-w-0">
                  <Award size="32" color="#555555" />
                  <div className="flex-1 min-w-0 ml-4">
                    <p className="text-sm font-bold text-gray-900">
                      Quests and Bounties
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Community quests and bounties
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">11</p>
                  <p className="mt-1 text-sm font-medium text-gray-500 truncate">
                    Active quests
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between space-x-5">
                <div className="flex items-center flex-1 min-w-0">
                  <BuyCrypto size="32" color="#555555" />
                  <div className="flex-1 min-w-0 ml-4">
                    <p className="text-sm font-bold text-gray-900">
                      Airdrop Engage to earn
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Community quests and bounties
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">11</p>
                  <p className="mt-1 text-sm font-medium text-gray-500 truncate">
                    Active quests
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-5">
                <div className="flex items-center flex-1 min-w-0">
                  <BuyCrypto size="32" color="#555555" />
                  <div className="flex-1 min-w-0 ml-4">
                    <p className="text-sm font-bold text-gray-900">
                      Airdrop Engage to earn
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Community quests and bounties
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">11</p>
                  <p className="mt-1 text-sm font-medium text-gray-500 truncate">
                    Active quests
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-5">
                <div className="flex items-center flex-1 min-w-0">
                  <BuyCrypto size="32" color="#555555" />
                  <div className="flex-1 min-w-0 ml-4">
                    <p className="text-sm font-bold text-gray-900">
                      Airdrop Engage to earn
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Community quests and bounties
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">11</p>
                  <p className="mt-1 text-sm font-medium text-gray-500 truncate">
                    Active quests
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="#"
                title=""
                className="inline-flex items-center text-xs font-semibold tracking-widest text-gray-500 uppercase hover:text-gray-900"
              >
                Explore Quests & Rewards
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
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
