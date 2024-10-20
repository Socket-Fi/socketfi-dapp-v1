import { useState, lazy, Suspense, useEffect } from "react";
import contractIds from "./utils/contract-ids.json";

import { isConnected, getPublicKey, getNetwork } from "@stellar/freighter-api";

import Home from "./pages/home/Home";
import Header from "./common/Header";
import ContractDapp from "./pages/contract-dapp/ContractDapp";
import Playground from "./pages/dapp-playground/Playground";
import Wallet from "./pages/socketfi-wallet/Wallet";
import DappComponents from "./pages/dapp-components/DappComponents";

import {
  Route,
  Routes,
  BrowserRouter as Router,
  useNavigate,
} from "react-router-dom";
import NotFound from "./not-found/NotFound";
import Layout from "./layout-screens/Layout";
import Quests from "./pages/rewards-quests/Quests";
import {
  server,
  getTxBuilder,
  FUTURENET_DETAILS,
  getAccount,
  BASE_FEE,
  getContractInfo,
  getAccountProfile,
  getTokens,
  stroopToXlm,
  accountToScVal,
  getTransactionCount,
  getOwnerAddress,
  getAllowance,
  getQuestXLM,
  invokeQuest,
  getIsWinner,
  getSelectionOpen,
  getHasClaimed,
} from "./utils/soroban";
import { Keypair } from "@stellar/stellar-sdk";
import { convertToUnixTimestamp, decrypt, signerSelect } from "./utils/config";
import axios from "axios";
import QuestPage from "./pages/rewards-quests/components/QuestPage";
import ProfilePage from "./pages/profile-page/ProfilePage";

// const { VITE_SECRET } = import.meta.env;
const { VITE_SECRET } = import.meta.env;
const STAT_URL = "https://history.socket.fi";

function App() {
  const [userKey, setUserKey] = useState("");
  const [network, setNetwork] = useState("");
  const [twiterAccount, setTwitterAccount] = useState(null);
  const [smartAccountIds, setSmartAccountIds] = useState([]);

  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [createStatus, setCreateStatus] = useState("");
  const [createStatusTwitter, setCreateStatusTwitter] = useState("");
  const [createWithTwitter, setCreateWithTwitter] = useState(false);
  const [isUseTwitter, setIsUseTwitter] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const [smartAccountCreatedWithTwitter, setSmartAccountCreatedWithTwitter] =
    useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSend, setIsOpenSend] = useState(false);
  const [allTokens, setAllTokens] = useState([]);
  const [dataUpdate, setDataUpdate] = useState("");
  const [processProgress, setProcessProgress] = useState({
    message: "",
    isDone: false,
  });

  const [txData, setTxData] = useState([]);

  const [userPoints, setUserPoints] = useState(null);
  const [transactionCount, setTransactionCount] = useState("");
  const [smartAllowance, setSmartAllowance] = useState("");
  const [smartOwner, setSmartOwner] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  // console.log("user points are", userPoints);
  const smartWalletContract = contractIds.WALLET.FUTURENET.address;
  const selectedNetwork = FUTURENET_DETAILS;
  const signers = VITE_SECRET ? VITE_SECRET.split("#") : [];

  const [isFetching, setIsFetching] = useState(
    localStorage.getItem("withTwitter") === "true"
  );
  const [isSend, setIsSend] = useState(true);

  const selectedSigner = signerSelect(signers);
  const signer = Keypair.fromSecret(selectedSigner.key);

  const sum = allTokens.reduce(
    (accumulator, currentValue) => accumulator + currentValue.balance,
    0
  );

  const questStatus = [
    smartAccountIds.length > 0,
    userPoints?.has_set_allowance,
    userPoints?.has_set_signer,
    userPoints?.has_sent,
    userPoints?.has_received,
    hasClaimed,
  ];

  const [rewardQuest, setRewardQuest] = useState(null);

  // console.log("account ids", smartAccountIds);

  const initAllQuests = [
    {
      id: 1,
      title: "Create Account",
      earn: "200XP & 25XLM* (1/5)",
      details:
        "This is an onboarding quest that requires you to create a smart account using your Twitter account. Creating a smart account this way binds your Twitter account to the created account, allowing you to seamlessly perform on-chain transactions using your Twitter login and password.",
      additionalDetails:
        "When this quest is completed, your Twitter-bound smart account will have been created. Completing this quest earns you on-chain points. You earn on-chain loyalty points for completing this quest and it is also 1st of 5 quests you need to complete to earn 25 XLM (FCFS).",
      onClick: () => {
        setIsOpen(true);
      },
    },
    {
      id: 2,
      title: "Set Allowance",
      earn: "200XP & 25XLM* (2/5)",
      details:
        "This is an onboarding quest that requires you to set your smart account allowance. Although your allowance was set when you created your account, this quest demonstrates how to adjust it after your smart account has been created.",
      additionalDetails:
        "This quest requires interaction with your smart account to set your allowance. The allowance defines the maximum amount that can be spent in a single transaction. You earn on-chain loyalty points for completing this quest and it is the 2nd of 5 quests you need to complete to earn 25 XLM (FCFS).",
      onClick: "navigate",
      route: "/profile",
    },
    {
      id: 3,
      title: "Set G Account",
      earn: "200XP & 25XLM* (3/5)",
      details:
        "This is an onboarding quest that requires you to set or link an external wallet account (G account) to your smart account. Note that you should only link your personal G account to your smart account, as a linked G account has access to the smart account it is connected to and can sign transactions on its behalf.",
      additionalDetails:
        "This quest requires interaction with your smart account to link a G account to it. The linked G account will have access to your smart account. You earn on-chain loyalty points for completing this quest and it is the 3rd of 5 quests you need to complete to earn 25 XLM (FCFS).",
      onClick: "navigate",
      route: "/profile",
    },
    {
      id: 4,
      title: "Receive Token",
      earn: "200XP & 25XLM* (4/5)",
      details:
        "This is an onboarding quest that requires you to send tokens (on FUTURENET) from an external G account to your smart account using the Freighter wallet (other wallets will be available soon). This quest demonstrates how to seamlessly receive any token in your smart account.",
      additionalDetails:
        "This quest requires interaction with your smart account to receive tokens from an external G account. You earn on-chain loyalty points for completing this quest, and it is the 4th of 5 quests you need to complete to earn 25 XLM (FCFS).",
      onClick: "navigate",
      route: "/",
    },
    {
      id: 5,
      title: "Send Token",
      earn: "200XP & 25XLM* (5/5)",
      details:
        "This is an onboarding quest that requires you to send tokens (on FUTURENET) from your smart account to an external G account or another smart account. This quest demonstrates how to seamlessly send any token in your smart account to another account.",
      additionalDetails:
        "This quest requires interaction with your smart account to send tokens from your smart account to an external G account or another smart account. You earn on-chain loyalty points for completing this quest, and it is the 5th of 5 quests you need to complete to earn 25 XLM (FCFS).",
      onClick: "navigate",
      route: "/",
    },
    {
      id: 6,
      title: "Claim reward XLM",
      earn: "25XLM",
      details: `Congratulations if you are one of the first x people to complete all 5 quests above. As this is a first-come, first-served quest, only the first x people who complete the quests will be rewarded with x XLM in addition to the points earned.`,
      additionalDetails: `This requires interacting with the SocketFi quest contract to claim your x XLM rewards. Please note that the reward will be sent to the external G account linked to your smart account.`,
      onClick: isWinner ? claimReward : "navigate",
      route: "/quests",
    },
  ];

  const questId = 2;

  const [allQuests, setAllQuests] = useState(initAllQuests);

  useEffect(() => {
    async function checkWinner() {
      const res = await getIsWinner(questId, smartOwner);
      const winnerCheck = res?.data;
      setIsWinner(() => winnerCheck);
      let quests = [...allQuests];
      quests[5].onClick = winnerCheck ? claimReward : "navigate ";
      setAllQuests(quests);
    }

    if (!!smartOwner) {
      checkWinner();
    }
  }, [smartOwner]);

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

  async function claimReward() {
    if (!smartOwner) {
      return;
    }

    const checkWinner = (await getIsWinner(questId, smartOwner))?.data;
    const hasClaimedVal = (await getHasClaimed(questId, smartOwner))?.data;

    // console.log("is win", checkWinner);
    // console.log("has claim", hasClaimedVal);

    if (checkWinner && !hasClaimedVal) {
      processStart("Claiming rewards...");
      const operation = "claim_reward";

      let args = [
        { value: questId, type: "u32" },
        {
          value: smartOwner,
          type: "Address",
        },
      ];
      const res = await invokeQuest(operation, args);
      console.log("claiming response", res);
      processEnd("Claiming done");
    } else if (hasClaimedVal && checkWinner) {
      alert("you have already claimed your rewards");
    } else {
      console.log("you were not selected");
    }
  }

  // console.log("all quest is", allQuests);
  //
  useEffect(() => {
    async function fetchXlmQuest(id) {
      const res = await getQuestXLM(id);

      if (res) {
        // const rewardAmt = Number(res.data.reward_rate._value) / 10 ** 7;
        // const payXLM = {
        //   id: 6,
        //   title: res.data.title,
        //   earn: "25XLM*",
        //   details: `Congratulations if you are one of the first ${res.data.winner_count} people to complete all 5 quests above. As this is a first-come, first-served quest, only the first ${res.data.winner_count} people who complete the quests will be rewarded with ${rewardAmt} XLM in addition to the points earned.`,
        //   additionalDetails: `This requires interacting with the SocketFi quest contract to claim your ${rewardAmt} XLM rewards. Please note that the reward will be sent to the external G account linked to your smart account.`,
        // };

        setRewardQuest(() => res?.data);
      }
    }
    fetchXlmQuest(questId);
  }, []);

  // console.log(allQuests);

  // console.log("connected twitter account", twiterAccount);
  // console.log(
  //   "unix timestamp equivalent",
  //   convertToUnixTimestamp(twiterAccount?.age)
  // );

  // useEffect(() => {
  //   async function select() {
  //     // await selectSigner();
  //     const encryptRes = await encryptText("Hello World", 1);

  //     console.log("encryption", encryptRes.data.data);
  //     const encryptVal = encryptRes.data.data;

  //     const decryptRes = await decryptText(
  //       encryptVal.encryptedHex,
  //       encryptVal.iv,
  //       1
  //     );

  //     console.log("decryption", decryptRes.data.data);
  //   }
  //   select();
  // }, []);

  async function addWinner(questStatus) {
    const selectionOpen = (await getSelectionOpen(questId))?.data;

    const res = await getIsWinner(questId, smartOwner);
    const winnerCheck = res?.data;
    setIsWinner(() => winnerCheck);
    const checkArr = questStatus.slice(0, -1);
    const completed = checkArr.every(Boolean); // Checks if all values are true
    if (!winnerCheck && selectionOpen && completed) {
      const operation = "add_winner";
      let args = [
        { value: questId, type: "u32" },
        {
          value: smartOwner,
          type: "Address",
        },
      ];
      const res = await invokeQuest(operation, args);
      console.log("add winner res", res);
    } else {
      console.log("not added");
    }
  }

  useEffect(() => {
    if (processProgress.message.length === 0) {
      setIsFetching(true);
    }
    const questStatus = [
      smartAccountIds.length > 0,
      userPoints?.has_set_allowance,
      userPoints?.has_set_signer,

      userPoints?.has_received,
      userPoints?.has_sent,
      hasClaimed,
    ];

    async function fetchHasClaimed() {
      const hasClaimedVal = (await getHasClaimed(questId, smartOwner))?.data;

      setHasClaimed(() => hasClaimedVal);
    }

    if (!!smartOwner) {
      fetchHasClaimed();
    }

    if (
      smartAccountIds.length > 0 &&
      !!smartOwner &&
      smartAccountIds[0].owner !== smartOwner
    ) {
      addWinner(questStatus);
    }

    const updatedQuests = allQuests.map((quest, index) => ({
      ...quest,
      status: questStatus[index], // Fallback in case of mismatch in array lengths
    }));

    setAllQuests(() => updatedQuests);
    setIsFetching(false);
  }, [smartAccountIds, userPoints, smartOwner]);

  useEffect(() => {
    async function fetchConnectedUser() {
      if (processProgress.message.length === 0) {
        setIsFetching(true);
      }
      const connected = await isConnected();
      const publicKey = await getPublicKey();
      const nt = await getNetwork();
      setUserKey(() => publicKey);
      setNetwork(() => nt);
      setIsWalletInstalled(() => connected);
      setIsFetching(false);
    }
    fetchConnectedUser();
  }, [userKey, network, isConnected, connecting]);

  function getUser() {
    return userKey;
  }

  useEffect(() => {
    async function fetchStats() {
      try {
        await axios.get(`${STAT_URL}/update-visits`, {
          withCredentials: true,
        });

        // console.log("visit data", res.data);

        // console.log("data", res2.data);
      } catch (error) {
        console.error("Error fetching Twitter auth data:", error);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function getTwitterAuth() {
      try {
        if (processProgress.message.length === 0) {
          setIsFetching(true);
        }
        const res = await axios.get(
          // "https://auth-twitter.socket.fi/auth/login/success",
          "https://twitter.socket.fi/auth/login/success",
          {
            withCredentials: true, // Include credentials in the request
          }
        );

        setTwitterAccount(() => res.data.user);
        localStorage.setItem("withTwitter", "false");
        // If your server responds with auth information, handle it here
        // Example:
        // const { token } = res.data;

        // setCreateWithTwitter(
        //   () => localStorage.getItem("withTwitter") === "true"
        // );
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching Twitter auth data:", error);
      }
    }

    if (
      localStorage.getItem("selectedMethod") === "twitter" &&
      smartAccountIds[0]?.owner !== userKey
    ) {
      getTwitterAuth();
    }
  }, [userKey, dataUpdate]);

  useEffect(() => {
    let allAccounts = [];
    async function fetchAccount() {
      if (processProgress.message.length === 0) {
        setIsFetching(true);
      }

      // console.log("all accounts", allAccounts);

      if (
        localStorage.getItem("selectedMethod") === "wallet" &&
        userKey.length > 0
      ) {
        const txBuilder = await getTxBuilder(
          userKey,
          BASE_FEE,
          server,
          selectedNetwork.networkPassphrase
        );

        const res = await getAccount({
          walletId: smartWalletContract,
          userPubKey: userKey,
          txBuilderAccount: txBuilder,
          server: server,
        });

        if (res !== null) {
          const account = { owner: userKey, accountId: res };

          if (
            !allAccounts.some(
              (existingAccount) =>
                existingAccount.accountId === account.accountId
            )
          ) {
            allAccounts.push(account);
          }
        }
      }

      // console.log("connected twitter is", twiterAccount);

      if (
        localStorage.getItem("selectedMethod") === "twitter" &&
        twiterAccount !== null
      ) {
        const txBuilder2 = await getTxBuilder(
          signer.publicKey(),
          BASE_FEE,
          server,
          selectedNetwork.networkPassphrase
        );

        const res2 = await getAccountProfile({
          walletId: smartWalletContract,
          profileId: twiterAccount?.twitterId,
          txBuilderAccount: txBuilder2,
          server: server,
        });

        // console.log("account with profile is", res2);

        if (res2?.length > 0) {
          const account = { owner: twiterAccount?.screenName, accountId: res2 };
          setSmartAccountCreatedWithTwitter(() => res2);

          // console.log("account with profile object", account);

          if (
            !allAccounts.some(
              (existingAccount) =>
                existingAccount.accountId === account.accountId
            )
          ) {
            allAccounts.push(account);
          }
        }
      }

      if (
        twiterAccount !== null &&
        allAccounts.length === 0 &&
        localStorage.getItem("login") === "true"
      ) {
        setIsUseTwitter(true);
        setIsOpen(true);
      }

      if (allAccounts.length > 0) {
        const txBuilder3 = await getTxBuilder(
          signer.publicKey(),
          BASE_FEE,
          server,
          selectedNetwork.networkPassphrase
        );

        let formatedTokens = [];
        const tokens = await getTokens({
          smartAccountId: allAccounts[0].accountId,
          txBuilderAccount: txBuilder3,
          server: server,
        });

        const txBuilderOwner = await getTxBuilder(
          signer.publicKey(),
          BASE_FEE,
          server,
          selectedNetwork.networkPassphrase
        );

        const owner = await getOwnerAddress({
          smartAccountId: allAccounts[0].accountId,
          txBuilderAccount: txBuilderOwner,
          server: server,
        });

        // console.log("the owners address is", owner);

        // setTransactionCount(() => txCount);

        setSmartOwner(() => owner);

        const txBuilderAllowance = await getTxBuilder(
          signer.publicKey(),
          BASE_FEE,
          server,
          selectedNetwork.networkPassphrase
        );

        //=====================================
        //issue with this code

        const allowance = await getAllowance({
          smartAccountId: allAccounts[0].accountId,
          txBuilderAccount: txBuilderAllowance,
          server: server,
        });

        if (allowance !== null) {
          const nativeAllowance = stroopToXlm(allowance).c.at(0);

          setSmartAllowance(() => nativeAllowance);
        }
        //=====================================

        // console.log("THE allowance is", nativeAllowance);

        const txBuilderCount = await getTxBuilder(
          signer.publicKey(),
          BASE_FEE,
          server,
          selectedNetwork.networkPassphrase
        );

        const txCount = await getTransactionCount({
          smartAccountId: allAccounts[0].accountId,
          txBuilderAccount: txBuilderCount,
          server: server,
        });

        setTransactionCount(() => txCount);

        // console.log("the tx count is", txCount);

        if (tokens.length > 0) {
          for (let token of tokens) {
            const txBuilder4 = await getTxBuilder(
              signer.publicKey(),
              BASE_FEE,
              server,
              selectedNetwork.networkPassphrase
            );
            const tokenSymbol = await getContractInfo({
              contractId: token.token_id,
              arg: "symbol",
              txBuilder: txBuilder4,
              server: server,
            });

            // console.log("the token symbol is", tokenSymbol);
            formatedTokens.push({
              balance: stroopToXlm(token.balance).c.at(0),
              symbol: tokenSymbol === "native" ? "XLM" : tokenSymbol,
              token_id: token.token_id,
            });
          }
        }

        if (allAccounts.length > 0) {
          const txBuilder5 = await getTxBuilder(
            signer.publicKey(),
            BASE_FEE,
            server,
            selectedNetwork.networkPassphrase
          );

          // console.log("the smart accoubt is", allAccounts[0].accountId);
          const accountPoints = await getContractInfo({
            contractId: allAccounts[0].accountId,
            arg: "get_user_points",
            txBuilder: txBuilder5,
            server: server,
          });

          // console.log("fine here");
          // console.log("all the fetched accounts", allAccounts);

          // console.log("the user points is", typeof accountPoints);
          setUserPoints(() => accountPoints);
        }

        setAllTokens(() => formatedTokens);
      }

      setSmartAccountIds(allAccounts);

      setIsFetching(() => false);
    }

    try {
      fetchAccount();
    } catch (e) {
      console.log("no account found");
    }

    // setIsFetching(false);
  }, [userKey, dataUpdate, twiterAccount]);

  const hasAccount = smartAccountIds.length > 0;

  useEffect(() => {
    async function fetchStats() {
      try {
        if (hasAccount) {
          const res = await axios.get(
            `${STAT_URL}/user-tx/:${smartAccountIds[0]?.accountId}`
          );

          setTxData(() => res?.data);

          // console.log("user data", res.data);
        }

        // console.log("data", res2.data);
      } catch (error) {
        console.error("Error fetching Twitter auth data:", error);
      }
    }
    fetchStats();
  }, [hasAccount, dataUpdate]);

  function handleOpenSend() {
    setIsOpenSend(() => true);
  }

  // async function testInvokeQuest() {
  //   const operation = "add_winner";
  //   console.log("clicked");
  //   let args = [
  //     { value: 1, type: "u32" },
  //     {
  //       value: "GDO33PF5IQNPOGAI7DZSJYREMJWGGMYV676B2LMXQP2SOKJRHXO5KCD7",
  //       type: "Address",
  //     },
  //   ];
  //   const res = await invokeQuest(operation, args);
  //   console.log("the res is", res);
  // }

  // async function testFxn() {
  //   const res = await getIsWinner(1, smartOwner);

  //   console.log("is winner res", res.data, typeof res.data);
  // }

  return (
    <div className="bg-gray-50 ">
      <Router>
        {/* <Header
          setNetwork={setNetwork}
          setUserKey={setUserKey}
          userKey={userkey}
          isWalletInstalled={isWalletInstalled}
          setConnecting={setConnecting}
          connecting={connecting}
        /> */}
        {/* <button onClick={testFxn}>Test Invoke</button> */}
        <Layout
          setSmartAccountIds={setSmartAccountIds}
          setNetwork={setNetwork}
          setUserKey={setUserKey}
          userKey={userKey}
          isWalletInstalled={isWalletInstalled}
          setConnecting={setConnecting}
          connecting={connecting}
          createStatus={createStatus}
          setCreateStatus={setCreateStatus}
          createStatusTwitter={createStatusTwitter}
          setCreateStatusTwitter={setCreateStatusTwitter}
          getUser={getUser}
          twiterAccount={twiterAccount}
          setTwitterAccount={setTwitterAccount}
          smartAccountIds={smartAccountIds}
          createWithTwitter={createWithTwitter}
          setCreateWithTwitter={setCreateWithTwitter}
          isUseTwitter={isUseTwitter}
          setIsUseTwitter={setIsUseTwitter}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isOpenSend={isOpenSend}
          setIsOpenSend={setIsOpenSend}
          smartWalletContract={smartWalletContract}
          setDataUpdate={setDataUpdate}
          processProgress={processProgress}
          setProcessProgress={setProcessProgress}
          smartAccountCreatedWithTwitter={smartAccountCreatedWithTwitter}
          isFetching={isFetching}
          setIsFetching={setIsFetching}
          allTokens={allTokens}
          isSend={isSend}
          setIsSend={setIsSend}
          userPoints={userPoints}
          sum={sum}
          transactionCount={transactionCount}
          smartAllowance={smartAllowance}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Wallet
                  txData={txData}
                  smartAllowance={smartAllowance}
                  isFetching={isFetching}
                  onOpenSend={handleOpenSend}
                  smartAccountIds={smartAccountIds}
                  userKey={userKey}
                  setNetwork={setNetwork}
                  setUserKey={setUserKey}
                  isWalletInstalled={isWalletInstalled}
                  setConnecting={setConnecting}
                  connecting={connecting}
                  allTokens={allTokens}
                  twiterAccount={twiterAccount}
                  setIsSend={setIsSend}
                  setIsOpen={setIsOpen}
                  sum={sum}
                />
              }
            />

            <Route
              path="/quests"
              element={
                <Quests
                  isWinner={isWinner}
                  hasClaimed={hasClaimed}
                  userKey={userKey}
                  setNetwork={setNetwork}
                  setUserKey={setUserKey}
                  isWalletInstalled={isWalletInstalled}
                  setConnecting={setConnecting}
                  connecting={connecting}
                  questStatus={questStatus}
                  userPoints={userPoints}
                  smartAccountIds={smartAccountIds}
                  selectedQuest={selectedQuest}
                  setSelectedQuest={setSelectedQuest}
                  allQuests={allQuests}
                  setAllQuests={setAllQuests}
                />
              }
            >
              <Route
                path=":id"
                element={
                  <QuestPage
                    isWinner={isWinner}
                    hasClaimed={hasClaimed}
                    selectedQuest={selectedQuest}
                    setSelectedQuest={setSelectedQuest}
                    allQuests={allQuests}
                  />
                }
              />
            </Route>

            <Route
              path="/profile"
              element={
                <ProfilePage
                  smartAllowance={smartAllowance}
                  smartOwner={smartOwner}
                  isFetching={isFetching}
                  onOpenSend={handleOpenSend}
                  smartAccountIds={smartAccountIds}
                  userKey={userKey}
                  setNetwork={setNetwork}
                  setUserKey={setUserKey}
                  isWalletInstalled={isWalletInstalled}
                  setConnecting={setConnecting}
                  connecting={connecting}
                  allTokens={allTokens}
                  twiterAccount={twiterAccount}
                  setIsSend={setIsSend}
                  setIsOpen={setIsOpen}
                  sum={sum}
                  dataUpdate={dataUpdate}
                  setDataUpdate={setDataUpdate}
                  processProgress={processProgress}
                  setProcessProgress={setProcessProgress}
                />
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
