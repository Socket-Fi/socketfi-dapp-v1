import React, { useState } from "react";
import { Copy, DocumentDownload, Code, Setting2 } from "iconsax-react";
import { rustCode } from "./codes/code-snippets";
import CodeBlock from "./CodeBlock";

export default function Playground() {
  return (
    <section className="py-2  sm:py-2 lg:py-4 h-screen ">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="md:flex md:items-end md:justify-between">
          <div className="sm:max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Soroban Playground
            </h1>
            <p className="mt-4 text-base font-normal leading-7 text-gray-600">
              Customize and simulate your smart contracts while building.
            </p>
          </div>
        </div>

        <div className="md:flex md:items-end md:justify-between mt-5">
          <div className="flex gap-4">
            <button
              type="button"
              className="items-center justify-center hidden px-4 py-2 gap-2 text-sm font-bold text-gray-100 transition-all duration-200 border border-gray-300  bg-gray-500 rounded-md md:inline-flex  hover:text-gray-900 focus:outline-none"
            >
              SEP-41
            </button>
            <button
              type="button"
              className="items-center justify-center hidden px-4 py- gap-2 text-sm font-bold text-gray-700 transition-all duration-200  rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              SAC
            </button>

            <button
              type="button"
              className="items-center justify-center hidden gap-2 px-4 py-2 text-sm font-bold text-gray-700 transition-all duration-200  rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              DAO
            </button>
            <button
              type="button"
              className="items-center justify-center hidden gap-2 px-4 py-2 text-sm font-bold text-gray-700 transition-all duration-200  rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              Custom
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="items-center justify-center hidden px-4 py-2 gap-2 text-sm font-bold text-gray-700 transition-all duration-200 border border-gray-300 rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              <Copy size="20" color="#697689" />
              Copy to Clipboard
            </button>
            <button
              type="button"
              className="items-center justify-center hidden px-4 py- gap-2 text-sm font-bold text-gray-700 transition-all duration-200 border border-gray-300 rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              <Code size="20" color="#697689" />
              Open in IDE
            </button>

            <button
              type="button"
              className="items-center justify-center hidden gap-2 px-4 py-2 text-sm font-bold text-gray-700 transition-all duration-200 border border-gray-300 rounded-md md:inline-flex hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            >
              <DocumentDownload size="20" color="#697689" />
              Download
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 mt-6 md:mt-10 lg:grid-cols-4 gap-x-4 gap-y-10">
          <div className="hidden space-y-8 lg:block">
            <div className="flow-root mt-5">
              <div className="-my-6 divide-y divide-gray-200">
                <div className="py-6 space-y-7">
                  <button
                    type="button"
                    className="inline-flex items-center p-1 -m-1 gap-2 text-base font-bold text-gray-900 transition-all duration-200 focus:outline-none group"
                  >
                    <Setting2 size="20" color="#697689" />
                    Settings
                  </button>

                  <hr className="mt-5 border-gray-200" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                    <div>
                      <label className="text-base font-medium text-gray-900">
                        {" "}
                        Name
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          type="tel"
                          name=""
                          id=""
                          placeholder="Token name"
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-base font-medium text-gray-900">
                        {" "}
                        Symbol
                      </label>
                      <div className="mt-2.5 relative mb-3">
                        <input
                          type="text"
                          name=""
                          id=""
                          placeholder="symbol"
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-x-5 gap-y-4">
                    <div>
                      <label className="text-base font-medium text-gray-900">
                        {" "}
                        Premint
                      </label>
                      <div className="mt-2.5 relative mb-3">
                        <input
                          type="text"
                          name=""
                          id=""
                          placeholder="Mint amount"
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-6 space-y-5">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-1 -m-1 text-base font-bold text-gray-900 transition-all duration-200 group focus:outline-none"
                  >
                    Features
                  </button>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded-sm focus:ring-gray-900"
                          checked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor=""
                          className="text-sm font-medium text-gray-700"
                        >
                          {" "}
                          Mintable
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded-sm focus:ring-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor=""
                          className="text-sm font-medium text-gray-700"
                        >
                          {" "}
                          Burnable
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded-sm focus:ring-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          // for=""
                          className="text-sm font-medium text-gray-700"
                        >
                          {" "}
                          Pausable
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded-sm focus:ring-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          // for=""
                          className="text-sm font-medium text-gray-700"
                        >
                          {" "}
                          Ownable
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded-sm focus:ring-gray-900"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          // for=""
                          className="text-sm font-medium text-gray-700"
                        >
                          {" "}
                          Roles
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 ">
            <div className="">
              <CodeBlock code={rustCode} language="rust" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
