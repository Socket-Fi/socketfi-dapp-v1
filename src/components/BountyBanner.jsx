export default function BountyBanner() {
  return (
    <div className="relative lg:col-span-2">
      <div className="absolute -inset-2">
        <div
          className="w-full h-full mx-auto rotate-180 opacity-30 blur-lg filter"
          style={{
            background:
              "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)",
          }}
        ></div>
      </div>

      <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl">
        <div className="p-6 md:p-8">
          <div className="flex gap-1 items-center">
            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              className="text-indigo-600
               h-16 w-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M127.251 107.939L108.093 88.7817C106.706 87.394 104.645 87.1926 102.995 88.0586L97.4997 82.5632C102.223 75.1197 105 66.3243 105 56.875C105 30.3387 83.4113 8.75 56.875 8.75C30.3387 8.75 8.75 30.3387 8.75 56.875C8.75 83.4113 30.3387 105 56.875 105C66.3243 105 75.1197 102.223 82.5632 97.4997L88.0586 102.995C87.1926 104.645 87.394 106.706 88.7817 108.093L107.939 127.251C110.516 129.832 113.947 131.25 117.595 131.25C121.24 131.25 124.67 129.832 127.251 127.251C132.574 121.923 132.574 113.259 127.251 107.939ZM17.7579 61.25H21.875C24.2932 61.25 26.25 59.2932 26.25 56.875C26.25 54.4568 24.2932 52.5 21.875 52.5H17.7579C19.7831 34.2793 34.2793 19.7831 52.5 17.7579V21.875C52.5 24.2932 54.4568 26.25 56.875 26.25C59.2932 26.25 61.25 24.2932 61.25 21.875V17.7579C79.4707 19.7831 93.9669 34.2793 95.9921 52.5H91.875C89.4568 52.5 87.5 54.4568 87.5 56.875C87.5 59.2932 89.4568 61.25 91.875 61.25H95.9921C93.9669 79.4707 79.4707 93.9669 61.25 95.9921V91.875C61.25 89.4568 59.2932 87.5 56.875 87.5C54.4568 87.5 52.5 89.4568 52.5 91.875V95.9921C34.2793 93.9669 19.7831 79.4707 17.7579 61.25ZM92.1092 89.5457L96.626 94.0625L94.0625 96.626L89.5457 92.1092C90.4325 91.2862 91.2862 90.4325 92.1092 89.5457ZM121.064 121.06C119.206 122.923 115.976 122.919 114.126 121.064L98.0615 105L105 98.0615L121.064 114.126C122.974 116.04 122.974 119.15 121.064 121.06Z"
                fill="currentColor"
              />
              <path
                d="M56.875 78.75C61.34 78.75 65.1935 75.896 67.5532 71.4812L70 72.7045V74.375C70 76.7932 71.9568 78.75 74.375 78.75C76.7932 78.75 78.75 76.7932 78.75 74.375V70C78.75 68.3423 77.8143 66.8298 76.3318 66.0864L69.8817 62.8615C69.9178 62.3224 70 61.8038 70 61.25C70 59.7245 69.8174 58.2769 69.5543 56.875H70C71.1621 56.875 72.2729 56.4136 73.0933 55.5933L77.4683 51.2183C79.1772 49.5093 79.1772 46.7407 77.4683 45.0317C75.7593 43.3228 72.9907 43.3228 71.2817 45.0317L68.1885 48.125H65.625C65.6066 48.125 65.5916 48.1351 65.5735 48.1354C64.7601 47.1795 63.8575 46.3712 62.877 45.7089C64.5606 44.1132 65.625 41.8715 65.625 39.375C65.625 34.5514 61.6986 30.625 56.875 30.625C52.0514 30.625 48.125 34.5514 48.125 39.375C48.125 41.8715 49.1894 44.1132 50.873 45.7089C49.8925 46.3712 48.9899 47.1795 48.1765 48.1354C48.1584 48.1351 48.1434 48.125 48.125 48.125H45.5615L42.4683 45.0317C40.7593 43.3228 37.9907 43.3228 36.2817 45.0317C34.5728 46.7407 34.5728 49.5093 36.2817 51.2183L40.6567 55.5933C41.4771 56.4136 42.5879 56.875 43.75 56.875H44.1957C43.9326 58.2769 43.75 59.7245 43.75 61.25C43.75 61.8038 43.8322 62.3224 43.8683 62.8615L37.4182 66.0864C35.9357 66.8298 35 68.3423 35 70V74.375C35 76.7932 36.9568 78.75 39.375 78.75C41.7932 78.75 43.75 76.7932 43.75 74.375V72.7045L46.1968 71.4812C48.5565 75.896 52.41 78.75 56.875 78.75ZM56.875 70C55.0891 70 52.5 66.5906 52.5 61.25C52.5 55.9094 55.0891 52.5 56.875 52.5C58.6609 52.5 61.25 55.9094 61.25 61.25C61.25 66.5906 58.6609 70 56.875 70Z"
                fill="currentColor"
              />
            </svg>
            <p className="text-2xl font-bold text-gray-900 font-pj">
              Account Bug Bounty
            </p>
          </div>
          <p className="mt-4 text-base font-normal leading-7 text-gray-600 font-pj">
            The first smart account created on SocketFi with Twitter
            authentication currently holds 5,000 XLM. If you can crack it, the
            funds are yours. To claim additional reward, you must submit a
            report detailing the security vulnerabilities you discovered.
          </p>
          <div className="flex gap-2 m-2 items-end">
            <p className=" text-md font-bold  font-pj ">Bounty Size:</p>

            <p className=" text-xl font-bold  font-pj text-blue-700">
              5,000 XLM
            </p>
          </div>

          <a
            href="#"
            title=""
            className="
                                  relative
                                  inline-flex
                                  items-center
                                  justify-center
                                  px-8
                                  py-3.5
                                  mt-5
                                  text-base
                                  font-bold
                                  text-white
                                  transition-all
                                  duration-200
                                  bg-gray-900
                                  border border-transparent
                                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                                  font-pj
                                  hover:bg-opacity-90
                                  rounded-xl
                              "
            role="button"
          >
            Get started cracking
          </a>
        </div>
      </div>
    </div>
  );
}
