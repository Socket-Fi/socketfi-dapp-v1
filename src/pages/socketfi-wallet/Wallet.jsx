import {
  ArrowDown,
  ArrowDown2,
  Award,
  BuyCrypto,
  GasStation,
  InfoCircle,
} from "iconsax-react";

import DappBanner from "../../components/DappBanner";
import WalletActions from "./WalletActions";
import TransactionHistory from "../../components/TransactionHistory";

export default function Wallet({
  allTokens,
  onOpenSend,
  twiterAccount,
  setIsSend,
  setIsOpen,
  smartAccountIds,
  txData,

  isFetching,
  sum,
  smartAllowance,
}) {
  // console.log("thes are the tokens", allTokens);

  function receiveHandler() {
    setIsSend(false);
    onOpenSend();
  }

  // console.log("the balance sum is", sum);
  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-6">
        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl lg:col-span-4 relative ">
          <div className="px-4 pt-5 sm:px-6 pb-3 ">
            <div className="grid grid-cols-4 items-center justify-between lg:pr-0 gap-4">
              <div className="flex gap-2 col-span-1">
                <p className="text-base font-bold text-gray-900 items-center justify-center">
                  Token
                </p>
                <InfoCircle size="20" />
              </div>

              <div className="flex gap-2 col-span-1">
                <p className="text-gray-700 text-sm font-medium items-center justify-center">
                  Portfolio %
                </p>
                <ArrowDown size="20" />
              </div>

              <div className="flex gap-2 col-span-1">
                <p className="text-gray-700 text-sm font-medium items-center justify-center">
                  Price
                </p>
              </div>

              <div className="flex gap-2 col-span-1">
                <p className="text-gray-700 text-sm font-medium items-center justify-center">
                  Balance
                </p>
              </div>
              <hr className="col-span-4" />
            </div>
            <div className="  flex flex-col justify-center">
              {" "}
              {allTokens.length === 0 &&
                (smartAccountIds.length === 0 ? (
                  <div className=" flex flex-col gap-4 items-center py-16 ">
                    {" "}
                    <div className=" w-full flex text-xl font-normal text-gray-600  text-center justify-center">
                      Log in to view your tokens, or create an account if you're
                      a new user.
                    </div>
                    <button
                      onClick={() => setIsOpen(true)}
                      type="button"
                      className={`  inline-flex items-center justify-center  px-6 py-2 text-sm font-semibold leading-5 text-white transition-all duration-200 border border-transparent rounded-full  ${"bg-gray-900 hover:-translate-y-[2px]"}`}
                    >
                      <svg
                        className="w-5 h-5 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      {/* <Send2 size="20" className="text-gray-100 mr-1" /> */}
                      Create Account or Login{" "}
                    </button>
                  </div>
                ) : (
                  <div className=" flex flex-col gap-4 items-center py-16">
                    {" "}
                    <div className=" w-full flex text-xl font-normal text-gray-600  text-center justify-center">
                      You currently have no tokens in your smart wallet!!!
                    </div>
                    <button
                      onClick={receiveHandler}
                      type="button"
                      className={`  inline-flex items-center justify-center  px-6 py-2 text-sm font-semibold leading-5 text-white transition-all duration-200 border border-transparent rounded-full  ${"bg-gray-900 hover:-translate-y-[2px]"}`}
                    >
                      <svg
                        className="w-5 h-5 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      {/* <Send2 size="20" className="text-gray-100 mr-1" /> */}
                      Receive token
                    </button>
                  </div>
                ))}
              {allTokens?.map((token) => (
                <div
                  className="grid grid-cols-4 items-end mt-3 justify-between lg:pr-0 gap-4 "
                  key={token?.token_id}
                >
                  <div className="flex gap-2 col-span-1">
                    <img
                      className="flex-shrink-0 object-cover w-7 h-7 rounded-full"
                      src={`/cryptoIcons/XLM.svg`}
                      alt=""
                    />
                    <p className="text-base font-bold text-gray-900 items-center justify-center">
                      {token?.symbol}
                    </p>
                  </div>

                  <div className="flex gap-2 col-span-1">
                    <p className="text-gray-700 text-sm font-medium items-center justify-center">
                      {sum !== 0
                        ? ((token?.balance * 100) / sum).toFixed(2)
                        : "-"}
                    </p>
                  </div>

                  <div className="flex gap-2 col-span-1">
                    <p className="text-gray-700 text-sm font-medium items-center justify-center">
                      $0.10
                    </p>
                  </div>

                  <div className="gap-2 col-span-1">
                    <p className="text-gray-700 text-sm font-medium items-center justify-center">
                      ${Number(token?.balance * 0.1).toFixed(2)}
                    </p>
                    <p className="text-gray-700 text-sm font-medium items-center justify-center">
                      {token.balance} {token?.symbol}
                    </p>
                  </div>
                  <hr className="col-span-4" />
                </div>
              ))}
              {allTokens.length > 0 && (
                <div
                  className={` ${
                    allTokens?.length < 3 &&
                    "absolute pl-5 pb-5 bottom-0 left-0"
                  }`}
                >
                  <WalletActions onOpenSend={onOpenSend} />
                </div>
              )}
            </div>
          </div>
        </div>

        <DappBanner />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-6">
        <TransactionHistory txData={txData} />
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
