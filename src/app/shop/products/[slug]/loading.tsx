import InfinityLoadingIcon from "@/components/icons/infinityLoading";
import React from "react";

const Loading = () => (
  <main className="bg-white flex-1 py-24">
    <div className={"mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"}>
      <div className="w-full h-full flex items-center justify-center">
        <InfinityLoadingIcon />
      </div>
    </div>
  </main>
);

export default Loading;
