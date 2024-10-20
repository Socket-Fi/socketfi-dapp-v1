import { NavLink } from "react-router-dom";
import Logo from "../assets/socketLogo.svg";
import Icon from "../assets/socketIcon.svg";
import {
  ArrowRight2,
  Award,
  BuyCrypto,
  CloseCircle,
  Profile,
} from "iconsax-react";
import { isCancel } from "axios";

export default function SideNav({
  onOpenCreate,
  sidebarIsOpen,
  smartAccountIds,
  onCloseSideBar,
}) {
  function twitterLogoutHandler() {
    localStorage.setItem("selectedMethod", "");
    // const twitterAuthUrl = "https://auth-twitter.socket.fi/auth/logout"; // Your Twitter OAuth URL
    const twitterAuthUrl = "https://twitter.socket.fi/auth/logout"; // Your Twitter OAuth URL

    // Redirect to the Twitter authentication URL in the same tab
    window.location.href = twitterAuthUrl;
  }

  function SmallScreenSiderBar() {
    if (!sidebarIsOpen) return null;
    return (
      <div
        className="   xl:hidden w-screen  bg-gray-900 bg-opacity-20 h-full z-20 absolute"
        onClick={onCloseSideBar}
      >
        <div
          className="flex flex-col pt-2 overflow-y-auto w-64 sticky h-screen bg-gray-50"
          onClick={(e) => e.stopPropagation()}
        >
          <CloseCircle
            className="h-7 text-gray-700 w-auto absolute top-2 right-2 cursor-pointer"
            onClick={onCloseSideBar}
          />
          <div className="flex flex-col  flex-1  px-4">
            <div className="space-y-4">
              <div className="">
                <div className="flex xl:ml-0">
                  <div className="flex items-center flex-shrink-0">
                    <img className=" w-auto h-10 " src={Logo} alt="" />
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200 "></div>
              {smartAccountIds[0]?.accountId.length > 0 ? (
                <div className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent">
                  <svg
                    className="w-7 h-auto mr-1 "
                    viewBox="0 0 140 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M90.9993 19.2559C82.8327 19.2559 75.8327 22.1725 69.9993 28.0059L57.166 40.8392C54.8327 43.1725 54.8327 46.6725 57.166 49.0059C59.4993 51.3392 62.9993 51.3392 65.3327 49.0059L78.166 36.1725C85.166 29.1725 96.8327 29.1725 103.833 36.1725C107.333 39.6725 109.083 44.3392 109.083 49.0059C109.083 53.6725 107.333 58.3392 103.833 61.8392L90.9993 74.6725C88.666 77.0059 88.666 80.5059 90.9993 82.8392C92.166 84.0059 93.916 84.5892 95.0827 84.5892C96.2493 84.5892 97.9993 84.0059 99.166 82.8392L111.999 70.0059C117.833 64.1725 120.749 57.1725 120.749 49.0059C120.749 40.8392 117.833 33.8392 111.999 28.0059C106.166 22.1725 99.166 19.2559 90.9993 19.2559Z"
                      fill="currentColor"
                    />
                    <path
                      d="M48.999 65.9264C51.3324 63.5931 51.3324 60.0931 48.999 57.7598C46.6657 55.4264 43.1657 55.4264 40.8324 57.7598L27.999 70.0098C22.1657 75.8431 19.249 82.8431 19.249 91.0098C19.249 99.1764 22.1657 106.176 27.999 112.01C33.8324 117.843 40.8324 120.76 48.999 120.76C57.1657 120.76 64.1657 117.843 69.999 112.01L82.8324 99.1764C85.1657 96.8431 85.1657 93.3431 82.8324 91.0098C80.499 88.6764 76.999 88.6764 74.6657 91.0098L61.8324 103.843C54.8324 110.843 43.1657 110.843 36.1657 103.843C32.6657 100.343 30.9157 95.6764 30.9157 91.0098C30.9157 86.3431 32.6657 81.6764 36.1657 78.1764L48.999 65.9264Z"
                      fill="currentColor"
                    />
                    <path
                      d="M53.082 86.9199C54.2487 88.0866 55.9987 88.6699 57.1654 88.6699C58.332 88.6699 60.082 88.0866 61.2487 86.9199L86.332 61.8366C88.6654 59.5033 88.6654 56.0033 86.332 53.6699C83.9987 51.3366 80.4987 51.3366 78.1654 53.6699L53.082 78.7533C50.7487 80.5033 50.7487 84.5866 53.082 86.9199Z"
                      fill="currentColor"
                    />
                  </svg>
                  Account Connected
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-lg focus:outline-none focus:ring-2 hover:bg-opacity-80 hover:-translate-y-[2px]"
                    onClick={onOpenCreate}
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
                    Create Account or Login
                  </button>
                </div>
              )}

              <nav className="flex-1 space-y-1">
                <NavLink
                  to="/"
                  title=""
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                      isActive
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-500 hover:bg-gray-200"
                    }`
                  }
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 mr-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </NavLink>
              </nav>

              <div>
                <nav className="flex-1 mt-4 space-y-1">
                  <a
                    href="#"
                    title=""
                    className="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg hover:bg-gray-200 group"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Transactions
                    <span className="text-xs uppercase ml-auto font-semibold text-white bg-gray-500 border border-transparent rounded-full inline-flex items-center px-2 py-0.5">
                      {" "}
                      15{" "}
                    </span>
                  </a>

                  <NavLink
                    to="/quests"
                    title=""
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                        isActive
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-500 hover:bg-gray-200"
                      }`
                    }
                  >
                    <Award className="h-5 w-auto text-gray-950 mr-4 animate-pulse" />
                    Rewards & Bounties
                  </NavLink>

                  <a
                    href="#"
                    title=""
                    className="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg hover:bg-gray-200 group"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                    dApps
                    <span className="text-xs ml-auto font-semibold text-orange-500 bg-indigo-50 border border-orange-300 rounded-full inline-flex items-center px-2 py-0.5">
                      {" "}
                      Coming soon
                    </span>
                  </a>
                </nav>
              </div>
            </div>

            {smartAccountIds[0]?.accountId.length > 0 && (
              <div className="pb-4 mt-12">
                <nav className="flex-1 space-y-1">
                  <NavLink
                    to="/profile"
                    title=""
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                        isActive
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-500 hover:bg-gray-200"
                      }`
                    }
                  >
                    <Profile className="text-gray-950 h-5 w-5 mr-4" />
                    Profile
                  </NavLink>

                  <button
                    onClick={twitterLogoutHandler}
                    className="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg hover:bg-gray-200 group"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="hidden xl:flex xl:w-64 xl:flex-col  ">
        <div className="flex flex-col pt-2 overflow-y-auto">
          <div className="flex flex-col justify-between flex-1 h-full px-4">
            <div className="space-y-4">
              <div className="">
                <div className="flex items-center -m-2 xl:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-lg hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
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
              <div className="border-b border-gray-200 "></div>
              {/* <div className="">
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-lg focus:outline-none focus:ring-2 hover:bg-opacity-80 hover:-translate-y-[2px]"
                  onClick={onOpenCreate}
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
                  Create Account or Login
                </button>
              </div> */}
              {smartAccountIds[0]?.accountId.length > 0 ? (
                <div className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent">
                  <svg
                    className="w-7 h-auto mr-1 "
                    viewBox="0 0 140 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M90.9993 19.2559C82.8327 19.2559 75.8327 22.1725 69.9993 28.0059L57.166 40.8392C54.8327 43.1725 54.8327 46.6725 57.166 49.0059C59.4993 51.3392 62.9993 51.3392 65.3327 49.0059L78.166 36.1725C85.166 29.1725 96.8327 29.1725 103.833 36.1725C107.333 39.6725 109.083 44.3392 109.083 49.0059C109.083 53.6725 107.333 58.3392 103.833 61.8392L90.9993 74.6725C88.666 77.0059 88.666 80.5059 90.9993 82.8392C92.166 84.0059 93.916 84.5892 95.0827 84.5892C96.2493 84.5892 97.9993 84.0059 99.166 82.8392L111.999 70.0059C117.833 64.1725 120.749 57.1725 120.749 49.0059C120.749 40.8392 117.833 33.8392 111.999 28.0059C106.166 22.1725 99.166 19.2559 90.9993 19.2559Z"
                      fill="currentColor"
                    />
                    <path
                      d="M48.999 65.9264C51.3324 63.5931 51.3324 60.0931 48.999 57.7598C46.6657 55.4264 43.1657 55.4264 40.8324 57.7598L27.999 70.0098C22.1657 75.8431 19.249 82.8431 19.249 91.0098C19.249 99.1764 22.1657 106.176 27.999 112.01C33.8324 117.843 40.8324 120.76 48.999 120.76C57.1657 120.76 64.1657 117.843 69.999 112.01L82.8324 99.1764C85.1657 96.8431 85.1657 93.3431 82.8324 91.0098C80.499 88.6764 76.999 88.6764 74.6657 91.0098L61.8324 103.843C54.8324 110.843 43.1657 110.843 36.1657 103.843C32.6657 100.343 30.9157 95.6764 30.9157 91.0098C30.9157 86.3431 32.6657 81.6764 36.1657 78.1764L48.999 65.9264Z"
                      fill="currentColor"
                    />
                    <path
                      d="M53.082 86.9199C54.2487 88.0866 55.9987 88.6699 57.1654 88.6699C58.332 88.6699 60.082 88.0866 61.2487 86.9199L86.332 61.8366C88.6654 59.5033 88.6654 56.0033 86.332 53.6699C83.9987 51.3366 80.4987 51.3366 78.1654 53.6699L53.082 78.7533C50.7487 80.5033 50.7487 84.5866 53.082 86.9199Z"
                      fill="currentColor"
                    />
                  </svg>
                  Account Connected
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-lg focus:outline-none focus:ring-2 hover:bg-opacity-80 hover:-translate-y-[2px]"
                    onClick={onOpenCreate}
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
                    Create Account or Login
                  </button>
                </div>
              )}

              <nav className="flex-1 space-y-1">
                <NavLink
                  to="/"
                  title=""
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                      isActive
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-500 hover:bg-gray-200"
                    }`
                  }
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 mr-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </NavLink>
              </nav>

              <div>
                <nav className="flex-1 mt-4 space-y-1">
                  <a
                    href="#"
                    title=""
                    className="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg hover:bg-gray-200 group"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Transactions
                    <span className="text-xs uppercase ml-auto font-semibold text-white bg-gray-500 border border-transparent rounded-full inline-flex items-center px-2 py-0.5">
                      {" "}
                      15{" "}
                    </span>
                  </a>

                  <NavLink
                    to="/quests"
                    title=""
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                        isActive
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-500 hover:bg-gray-200"
                      }`
                    }
                  >
                    <Award className="h-5 w-auto text-gray-950 mr-4 animate-pulse" />
                    Rewards & Bounties
                  </NavLink>

                  <a
                    href="#"
                    title=""
                    className="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg hover:bg-gray-200 group"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                    dApps
                    <span className="text-xs ml-auto font-semibold text-orange-500 bg-indigo-50 border border-orange-300 rounded-full inline-flex items-center px-2 py-0.5">
                      {" "}
                      Coming soon
                    </span>
                  </a>
                </nav>
              </div>
            </div>

            {smartAccountIds[0]?.accountId.length > 0 && (
              <div className="pb-4 mt-12">
                <nav className="flex-1 space-y-1">
                  <NavLink
                    to="/profile"
                    title=""
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                        isActive
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-500 hover:bg-gray-200"
                      }`
                    }
                  >
                    <Profile className="text-gray-950 h-5 w-5 mr-4" />
                    Profile
                  </NavLink>

                  <button
                    onClick={twitterLogoutHandler}
                    className="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg hover:bg-gray-200 group"
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
      <SmallScreenSiderBar />
    </div>
  );
}
