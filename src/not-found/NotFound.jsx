import React, { useState } from "react";
import { Link } from "react-router-dom";

import sorobanBanner from "../assets/sorobanBanner.png";
import { EmojiSad } from "iconsax-react";

export default function NotFound() {
  return (
    <div className="overflow-x-hidden bg-gray-100 h-screen justify-center ">
      <section className="relative py-12 sm:py-16 lg:pt-20 xl:pb-0">
        <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-row mt-5 justify-center text-center items-center gap-2 ">
              <EmojiSad size="36" color="#000000" variant="Bold" />
              <h1 className="text-4xl font-semibold leading-tight text-gray-900 sm:text-4xl sm:leading-tight lg:text-4xl lg:leading-tight font-pj">
                Page not found!!!
              </h1>
            </div>

            <div className="relative inline-flex mt-10 group">
              <Link
                to="./"
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl "
                role="button"
              >
                Return to homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
