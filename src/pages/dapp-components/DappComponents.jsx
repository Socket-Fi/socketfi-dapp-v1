import React, { useState } from "react";

const DappComponents = () => {
  return (
    <section className="py-12  sm:py-16 lg:py-20 h-screen">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-pj">
            Reuseable Soroban dApp Components
          </h2>
        </div>

        <div className="relative mt-14">
          <div className="absolute -inset-2">
            <div
              className="w-full h-full max-w-4xl mx-auto opacity-30 blur-lg filter"
              style={{
                background:
                  "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)",
              }}
            ></div>
          </div>

          <div className="relative grid max-w-4xl grid-cols-1 gap-5 mx-auto sm:gap-6 lg:gap-10 sm:grid-cols-2">
            <div className="bg-white shadow-xl rounded-xl">
              <div className="p-8 sm:py-10 sm:px-9">
                <div className="flex justify-start flex-shrink-0 -space-x-4 overflow-hidden">
                  <div className="inline-flex items-center justify-center bg-gray-100 rounded-full w-14 h-14 ring-2 ring-white">
                    <svg
                      className="inline-block rounded-full w-16 h-16 ring-2 ring-white"
                      viewBox="0 0 136 136"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M119 35.2467L22.6667 73.6667C22.4411 71.7862 22.3276 69.894 22.3267 68.0001C22.3035 60.8661 23.9942 53.831 27.2567 47.4867C31.0438 40.0232 36.8232 33.7538 43.9545 29.373C51.0858 24.9922 59.2906 22.671 67.66 22.6667C72.816 22.6556 77.935 23.5375 82.79 25.2734"
                        stroke="black"
                        strokeWidth="11.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M53.1533 110.727C63.5362 114.411 74.9056 114.189 85.1363 110.101C95.3671 106.013 103.759 98.3387 108.743 88.5134C112.006 82.1691 113.697 75.134 113.673 68C113.675 66.106 113.561 64.2136 113.333 62.3334L17 100.753"
                        stroke="black"
                        strokeWidth="11.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="inline-flex items-center justify-center bg-gray-100 rounded-full w-14 h-14 ring-2 ring-white">
                    <svg
                      className="w-5 h-5 text-gray-900"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 3C10.5523 3 11 3.44772 11 4V9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11H4C3.44772 11 3 10.5523 3 10C3 9.44771 3.44772 9 4 9L9 9V4C9 3.44772 9.44772 3 10 3Z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 font-pj mt-11">
                  Staking UI Component
                </h3>
                <p className="mt-3 text-base font-normal leading-7 text-gray-600">
                  Plug-and-play reusable staking and liquidity pool components
                  for Soroban dApp.
                </p>

                <a
                  href="mailto:info@sorobuild.io?subject=Demo%20Request%20Staking"
                  title=""
                  className="inline-flex items-center justify-center px-8 py-3 mt-8 text-base font-bold text-gray-900 transition-all duration-200 border-2 border-gray-400 rounded-xl font-pj hover:bg-gray-900 focus:bg-gray-900 hover:text-white focus:text-white hover:border-gray-900 focus:border-gray-900"
                  role="button"
                >
                  Request Demo
                </a>
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-xl">
              <div className="p-8 sm:py-10 sm:px-9">
                {/* <div className="flex items-center h-14">
                  <img
                    className="w-auto h-10"
                    src="https://cdn.rareblocks.xyz/collection/clarity/images/cta/1/logo-1.svg"
                    alt=""
                  />
                  <img
                    className="w-auto h-10 ml-3"
                    src="https://cdn.rareblocks.xyz/collection/clarity/images/cta/1/logo-2.svg"
                    alt=""
                  />
                  <img
                    className="w-auto h-10 ml-5"
                    src="https://cdn.rareblocks.xyz/collection/clarity/images/cta/1/logo-3.svg"
                    alt=""
                  />

                  <div className="inline-flex items-center justify-center bg-gray-100 rounded-full w-14 h-14 ring-2 ring-white">
                    <svg
                      className="inline-block rounded-full w-16 h-16 ring-2 ring-white"
                      viewBox="0 0 136 136"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M119 35.2467L22.6667 73.6667C22.4411 71.7862 22.3276 69.894 22.3267 68.0001C22.3035 60.8661 23.9942 53.831 27.2567 47.4867C31.0438 40.0232 36.8232 33.7538 43.9545 29.373C51.0858 24.9922 59.2906 22.671 67.66 22.6667C72.816 22.6556 77.935 23.5375 82.79 25.2734"
                        stroke="black"
                        strokeWidth="11.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M53.1533 110.727C63.5362 114.411 74.9056 114.189 85.1363 110.101C95.3671 106.013 103.759 98.3387 108.743 88.5134C112.006 82.1691 113.697 75.134 113.673 68C113.675 66.106 113.561 64.2136 113.333 62.3334L17 100.753"
                        stroke="black"
                        strokeWidth="11.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="inline-flex items-center justify-center bg-gray-100 rounded-full w-14 h-14 ring-2 ring-white">
                    <svg
                      className="w-5 h-5 text-gray-900"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 3C10.5523 3 11 3.44772 11 4V9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11H4C3.44772 11 3 10.5523 3 10C3 9.44771 3.44772 9 4 9L9 9V4C9 3.44772 9.44772 3 10 3Z"
                      />
                    </svg>
                  </div>
                </div> */}

                <div className="flex justify-start flex-shrink-0 -space-x-4 overflow-hidden">
                  <div className="inline-flex items-center justify-center bg-gray-100 rounded-full w-14 h-14 ring-2 ring-white">
                    <svg
                      className="inline-block rounded-full w-16 h-16 ring-2 ring-white"
                      viewBox="0 0 136 136"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M119 35.2467L22.6667 73.6667C22.4411 71.7862 22.3276 69.894 22.3267 68.0001C22.3035 60.8661 23.9942 53.831 27.2567 47.4867C31.0438 40.0232 36.8232 33.7538 43.9545 29.373C51.0858 24.9922 59.2906 22.671 67.66 22.6667C72.816 22.6556 77.935 23.5375 82.79 25.2734"
                        stroke="black"
                        strokeWidth="11.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M53.1533 110.727C63.5362 114.411 74.9056 114.189 85.1363 110.101C95.3671 106.013 103.759 98.3387 108.743 88.5134C112.006 82.1691 113.697 75.134 113.673 68C113.675 66.106 113.561 64.2136 113.333 62.3334L17 100.753"
                        stroke="black"
                        strokeWidth="11.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="inline-flex items-center justify-center bg-gray-100 rounded-full w-14 h-14 ring-2 ring-white">
                    <svg
                      width="136"
                      height="136"
                      viewBox="0 0 136 136"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M89.1226 78.37C94.9451 79.3475 101.363 78.3275 105.868 75.31C111.86 71.315 111.86 64.77 105.868 60.775C101.32 57.7575 94.8176 56.7375 88.9951 57.7575M46.7501 78.37C40.9276 79.3475 34.5101 78.3275 30.0051 75.31C24.0126 71.315 24.0126 64.77 30.0051 60.775C34.5526 57.7575 41.0551 56.7375 46.8776 57.7575M93.5001 47.43C93.2326 47.3875 92.9601 47.3875 92.6926 47.43C89.8563 47.3274 87.171 46.1261 85.2041 44.08C83.2373 42.0338 82.143 39.3032 82.1526 36.465C82.1526 30.3875 87.0401 25.5 93.1176 25.5C96.0257 25.5 98.8147 26.6552 100.871 28.7116C102.927 30.7679 104.083 33.5569 104.083 36.465C104.075 39.3052 102.969 42.0323 100.997 44.076C99.0244 46.1196 96.3382 47.3214 93.5001 47.43ZM42.3726 47.43C42.6276 47.3875 42.9251 47.3875 43.1801 47.43C46.0164 47.3274 48.7018 46.1261 50.6686 44.08C52.6354 42.0338 53.7297 39.3032 53.7201 36.465C53.7201 30.3875 48.8326 25.5 42.7551 25.5C39.847 25.5 37.058 26.6552 35.0017 28.7116C32.9454 30.7679 31.7901 33.5569 31.7901 36.465C31.8326 42.415 36.5076 47.2175 42.3726 47.43ZM68.0001 79.1775C67.7326 79.135 67.4601 79.135 67.1926 79.1775C64.3563 79.0749 61.671 77.8736 59.7041 75.8275C57.7373 73.7813 56.643 71.0507 56.6526 68.2125C56.6526 62.135 61.5401 57.2475 67.6176 57.2475C70.5257 57.2475 73.3147 58.4027 75.371 60.4591C77.4274 62.5154 78.5826 65.3044 78.5826 68.2125C78.5401 74.1625 73.8651 79.0075 68.0001 79.1775ZM55.6326 92.565C49.6401 96.56 49.6401 103.105 55.6326 107.1C62.4326 111.648 73.5676 111.648 80.3676 107.1C86.3601 103.105 86.3601 96.56 80.3676 92.565C73.6101 88.06 62.4326 88.06 55.6326 92.565Z"
                        stroke="black"
                        strokeWidth="6.375"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="inline-flex items-center justify-center bg-gray-100 rounded-full w-14 h-14 ring-2 ring-white">
                    <svg
                      className="w-5 h-5 text-gray-900"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 3C10.5523 3 11 3.44772 11 4V9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11H4C3.44772 11 3 10.5523 3 10C3 9.44771 3.44772 9 4 9L9 9V4C9 3.44772 9.44772 3 10 3Z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 font-pj mt-11">
                  DAO Component
                </h3>
                <p className="mt-3 text-base font-normal leading-7 text-gray-600">
                  Plug and play reuseable staking and liquidity pool for Soroban
                  dApp components
                </p>

                <a
                  href="mailto:info@sorobuild.io?subject=Demo%20Request%20DAO"
                  title=""
                  className="inline-flex items-center justify-center px-8 py-3 mt-8 text-base font-bold text-gray-900 transition-all duration-200 border-2 border-gray-400 rounded-xl font-pj hover:bg-gray-900 focus:bg-gray-900 hover:text-white focus:text-white hover:border-gray-900 focus:border-gray-900"
                  role="button"
                >
                  Request Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DappComponents;
