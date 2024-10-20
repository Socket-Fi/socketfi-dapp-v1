import { useState } from "react";

export default function SelectToken({
  allTokens,
  selectedToken,
  setSelectedToken,
}) {
  //   const [selectedToken, setSelectedToken] = useState("");

  // console.log("the selected token is", selectedToken);
  return (
    <div className="">
      <div className="relative w-[150px] mb-4">
        <select
          className="block w-full px-4 py-3 pr-8 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 appearance-none"
          id="type-select"
          value={selectedToken?.symbol}
          onChange={(e) => {
            const selectedSymbol = e.target.value;
            const matchingToken = allTokens?.find(
              (token) => token.symbol === selectedSymbol
            );
            setSelectedToken(matchingToken); // Set the entire token object
          }}
        >
          <option value="select type">Select token</option>
          {allTokens?.map((token) => (
            <option value={token?.symbol}>{token?.symbol}</option>
          ))}
        </select>

        {/* Custom icon */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-10 h-auto text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 12l-3-3h6l-3 3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
