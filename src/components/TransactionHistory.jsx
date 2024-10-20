export default function TransactionHistory({ txData }) {
  // console.log("tx history", txData);

  function convertUnixToDate(unixTimestamp) {
    // Create a new Date object using the Unix timestamp (in milliseconds)
    const date = new Date(unixTimestamp * 1000); // Unix timestamps are in seconds, so multiply by 1000

    // Format the date to include day, month, year, and time (hours and minutes)
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // To get 12-hour format (use false for 24-hour format)
    });

    return formattedDate;
  }
  function truncateString(input) {
    const startLength = 8; // Fixed number of characters to keep at the start
    const endLength = 4; // Fixed number of characters to keep at the end
    const mask = "****"; // Fixed mask for the middle part

    // Ensure the input is long enough for truncation
    if (input.length <= startLength + endLength) {
      return input; // Return the original string if it's too short to truncate
    }

    const start = input.slice(0, startLength);
    const end = input.slice(-endLength);

    return `${start} ${mask} ${end}`;
  }

  // Example usage
  const input = "GDO33PF5IQNPOGAI7DZSJYREMJWGGMYV676B2LMXQP2SOKJRHXO5KCD7";
  const truncated = truncateString(input);

  // console.log(truncated); // Output: GDO33PF5 **** KCD7

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl lg:col-span-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-bold text-gray-900">
              Transaction History
            </p>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Your 5 most recent transactions are as follows
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <a
              href="#"
              title=""
              className="inline-flex items-center text-xs font-semibold tracking-widest text-gray-500 uppercase hover:text-gray-900"
            >
              View all Transactions
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

      <div className="divide-y divide-gray-200">
        {txData?.map((tx) => (
          <div
            key={tx?._id}
            className="grid grid-cols-3 py-1 gap-y-4 lg:gap-0 lg:grid-cols-6"
          >
            <div className="col-span-2 px-4 lg:py-4 sm:px-6 lg:col-span-1">
              <span className="text-xs font-medium text-green-900 bg-green-100 rounded-full inline-flex items-center px-2.5 py-1">
                <svg
                  className="-ml-1 mr-1.5 h-2.5 w-2.5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 8 8"
                >
                  <circle cx="4" cy="4" r="3"></circle>
                </svg>
                {tx?.status === "SUCCESS" ? "Completed" : "Pending"}
              </span>
            </div>

            <div className="px-4 text-right lg:py-4 sm:px-6 lg:order-last">
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                <svg
                  className="w-4 h-auto ml-2 "
                  viewBox="0 0 49 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M33.8328 0L30.2974 3.5444L38.929 12.1859H17.98C8.0549 12.1859 0 20.2475 0 30.1722C0 40.0979 8 48.1684 18 48.1684V43.1685C11 43.1685 5.0001 37.3365 5.0001 30.1677C5.0001 22.9998 10.8221 17.1688 17.9902 17.1688C25.9417 17.1683 30.9282 17.1679 38.9253 17.1673L30.3065 25.784L33.8405 29.3191L48.4955 14.663L33.8328 0Z"
                    fill="#565D64"
                  />
                </svg>
              </button>
            </div>

            <div className="px-4 lg:py-4 sm:px-6 lg:col-span-2">
              <p className="text-sm font-bold text-gray-900">
                {truncateString(tx?.recipient)}
              </p>

              <div className="flex gap-2 items-center">
                {tx?.type === "send" && (
                  <svg
                    className="h-4 w-auto text-red-500"
                    viewBox="0 0 90 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M75.9473 80.8984H14.3262C9.17969 80.8984 5 76.7188 5 71.5723V55.6055H10.8594V71.5723C10.8594 73.4863 12.4121 75.0391 14.3262 75.0391H75.9473C77.8613 75.0391 79.4141 73.4863 79.4141 71.5723V55.6055H85.2734V71.5723C85.2734 76.7188 81.0938 80.8984 75.9473 80.8984Z"
                      fill="currentColor"
                    />
                    <path
                      d="M25.1465 32.373L45.1367 10L65.127 32.373H48.0664V62.2559H42.207V32.373H25.1465Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {tx?.type === "receive" && (
                  <svg
                    className="h-4 w-auto text-green-700"
                    viewBox="0 0 90 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M75.9473 80.8984H14.3262C9.17969 80.8984 5 76.7188 5 71.5723V55.6055H10.8594V71.5723C10.8594 73.4863 12.4121 75.0391 14.3262 75.0391H75.9473C77.8613 75.0391 79.4141 73.4863 79.4141 71.5723V55.6055H85.2734V71.5723C85.2734 76.7188 81.0938 80.8984 75.9473 80.8984Z"
                      fill="currentColor"
                    />
                    <path
                      d="M65.127 39.8828L45.1367 62.2559L25.1465 39.8828H42.207V10H48.0664V39.8828H65.127Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <p className="mt-1 text-sm font-medium text-gray-500">
                  {tx?.type === "receive" && "Receive from"}
                  {tx?.type === "send" && "Send to"}
                </p>{" "}
              </div>
            </div>

            <div className="px-4 lg:py-4 sm:px-6">
              <p className="text-sm font-bold text-gray-900">${tx?.value}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {tx?.amount} {tx?.symbol}
              </p>
            </div>

            <div className="px-4 lg:py-4 sm:px-6">
              <p className="mt-1 text-sm font-medium text-gray-500">
                {convertUnixToDate(tx?.date)}
              </p>
            </div>
          </div>
        ))}
        {/* <div className="grid grid-cols-3 py-2 gap-y-4 lg:gap-0 lg:grid-cols-6">
          <div className="col-span-2 px-4 lg:py-4 sm:px-6 lg:col-span-1">
            <span className="text-xs font-medium text-green-900 bg-green-100 rounded-full inline-flex items-center px-2.5 py-1">
              <svg
                className="-ml-1 mr-1.5 h-2.5 w-2.5 text-green-500"
                fill="currentColor"
                viewBox="0 0 8 8"
              >
                <circle cx="4" cy="4" r="3"></circle>
              </svg>
              Completed
            </span>
          </div>

          <div className="px-4 text-right lg:py-4 sm:px-6 lg:order-last">
            <button
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <svg
                className="w-4 h-auto ml-2 "
                viewBox="0 0 49 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M33.8328 0L30.2974 3.5444L38.929 12.1859H17.98C8.0549 12.1859 0 20.2475 0 30.1722C0 40.0979 8 48.1684 18 48.1684V43.1685C11 43.1685 5.0001 37.3365 5.0001 30.1677C5.0001 22.9998 10.8221 17.1688 17.9902 17.1688C25.9417 17.1683 30.9282 17.1679 38.9253 17.1673L30.3065 25.784L33.8405 29.3191L48.4955 14.663L33.8328 0Z"
                  fill="#565D64"
                />
              </svg>
            </button>
          </div>

          <div className="px-4 lg:py-4 sm:px-6 lg:col-span-2">
            <p className="text-sm font-bold text-gray-900">
              GDO33PF5IQN **** KCD7
            </p>

            <div className="flex gap-2 items-center">
              <svg
                className="h-4 w-auto"
                viewBox="0 0 90 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M75.9473 80.8984H14.3262C9.17969 80.8984 5 76.7188 5 71.5723V55.6055H10.8594V71.5723C10.8594 73.4863 12.4121 75.0391 14.3262 75.0391H75.9473C77.8613 75.0391 79.4141 73.4863 79.4141 71.5723V55.6055H85.2734V71.5723C85.2734 76.7188 81.0938 80.8984 75.9473 80.8984Z"
                  fill="black"
                />
                <path
                  d="M25.1465 32.373L45.1367 10L65.127 32.373H48.0664V62.2559H42.207V32.373H25.1465Z"
                  fill="black"
                />
              </svg>
              <p className="mt-1 text-sm font-medium text-gray-500">Send to</p>{" "}
            </div>
          </div>

          <div className="px-4 lg:py-4 sm:px-6">
            <p className="text-sm font-bold text-gray-900">$80.12</p>
            <p className="mt-1 text-sm font-medium text-gray-500">900 XLM</p>
          </div>

          <div className="px-4 lg:py-4 sm:px-6">
            <p className="mt-1 text-sm font-medium text-gray-500">
              Jan 17, 2022
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 py-2 gap-y-4 lg:gap-0 lg:grid-cols-6">
          <div className="col-span-2 px-4 lg:py-4 sm:px-6 lg:col-span-1">
            <span className="text-xs font-medium text-yellow-900 bg-yellow-100 rounded-full inline-flex items-center px-2.5 py-1">
              <svg
                className="-ml-1 mr-1.5 h-2.5 w-2.5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 8 8"
              >
                <circle cx="4" cy="4" r="3"></circle>
              </svg>
              Pending
            </span>
          </div>

          <div className="px-4 text-right lg:py-4 sm:px-6 lg:order-last">
            <button
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <svg
                className="w-4 h-auto ml-2 "
                viewBox="0 0 49 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M33.8328 0L30.2974 3.5444L38.929 12.1859H17.98C8.0549 12.1859 0 20.2475 0 30.1722C0 40.0979 8 48.1684 18 48.1684V43.1685C11 43.1685 5.0001 37.3365 5.0001 30.1677C5.0001 22.9998 10.8221 17.1688 17.9902 17.1688C25.9417 17.1683 30.9282 17.1679 38.9253 17.1673L30.3065 25.784L33.8405 29.3191L48.4955 14.663L33.8328 0Z"
                  fill="#565D64"
                />
              </svg>
            </button>
          </div>

          <div className="px-4 lg:py-4 sm:px-6 lg:col-span-2">
            <p className="text-sm font-bold text-gray-900">
              CCFL7SM2M6A **** LIVR
            </p>

            <div className="flex gap-2 items-center">
              <svg
                className="h-4 w-auto"
                viewBox="0 0 90 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.7932 40.7567L5 58.5944L22.7932 76.4322V63.0539H54.0539V54.135H22.7932V40.7567ZM85.27 31.8378L67.4768 14V27.3783H36.2161V36.2972H67.4768V49.6756L85.27 31.8378Z"
                  fill="black"
                />
              </svg>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Swap to USDC
              </p>{" "}
            </div>
          </div>

          <div className="px-4 lg:py-4 sm:px-6">
            <p className="text-sm font-bold text-gray-900">$80.12</p>
            <p className="mt-1 text-sm font-medium text-gray-500">900 XLM</p>
          </div>

          <div className="px-4 lg:py-4 sm:px-6">
            <p className="mt-1 text-sm font-medium text-gray-500">
              Jan 17, 2022
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 py-2 gap-y-4 lg:gap-0 lg:grid-cols-6">
          <div className="col-span-2 px-4 lg:py-4 sm:px-6 lg:col-span-1">
            <span className="text-xs font-medium text-red-900 bg-red-100 rounded-full inline-flex items-center px-2.5 py-1">
              <svg
                className="-ml-1 mr-1.5 h-2.5 w-2.5 text-red-500"
                fill="currentColor"
                viewBox="0 0 8 8"
              >
                <circle cx="4" cy="4" r="3"></circle>
              </svg>
              Failed
            </span>
          </div>

          <div className="px-4 text-right lg:py-4 sm:px-6 lg:order-last">
            <button
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <svg
                className="w-4 h-auto ml-2 "
                viewBox="0 0 49 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M33.8328 0L30.2974 3.5444L38.929 12.1859H17.98C8.0549 12.1859 0 20.2475 0 30.1722C0 40.0979 8 48.1684 18 48.1684V43.1685C11 43.1685 5.0001 37.3365 5.0001 30.1677C5.0001 22.9998 10.8221 17.1688 17.9902 17.1688C25.9417 17.1683 30.9282 17.1679 38.9253 17.1673L30.3065 25.784L33.8405 29.3191L48.4955 14.663L33.8328 0Z"
                  fill="#565D64"
                />
              </svg>
            </button>
          </div>

          <div className="px-4 lg:py-4 sm:px-6 lg:col-span-2">
            <p className="text-sm font-bold text-gray-900">
              CCFL7SM2M6A **** LIVR
            </p>

            <div className="flex gap-2 items-center">
              <svg
                className="h-4 w-auto text-red-500"
                viewBox="0 0 90 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M73.3483 65.3983L52.95 45L73.3483 24.6017C75.5506 22.3995 75.5506 18.854 73.3483 16.6517C71.146 14.4494 67.6006 14.4494 65.3983 16.6517L45 37.05L24.6017 16.6517C22.3995 14.4494 18.854 14.4494 16.6517 16.6517C14.4494 18.854 14.4494 22.3995 16.6517 24.6017L37.05 45L16.6517 65.3983C14.4494 67.6006 14.4494 71.146 16.6517 73.3483C18.854 75.5506 22.3995 75.5506 24.6017 73.3483L45 52.95L65.3983 73.3483C67.6006 75.5506 71.146 75.5506 73.3483 73.3483C75.535 71.146 75.535 67.5849 73.3483 65.3983Z"
                  fill="currentColor"
                />
              </svg>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Swap to USDC
              </p>{" "}
            </div>
          </div>

          <div className="px-4 lg:py-4 sm:px-6">
            <p className="text-sm font-bold text-gray-900">$80.12</p>
            <p className="mt-1 text-sm font-medium text-gray-500">900 XLM</p>
          </div>

          <div className="px-4 lg:py-4 sm:px-6">
            <p className="mt-1 text-sm font-medium text-gray-500">
              Jan 17, 2022
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
