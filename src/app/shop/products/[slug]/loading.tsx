import React from "react";

const LoadingIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width="200"
      height="200"
      style={{
        shapeRendering: "auto",
        display: "block",
        background: "transparent",
      }}
    >
      <g>
        <path
          style={{ transform: "scale(0.8)", transformOrigin: "50px 50px" }}
          strokeLinecap="round"
          d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
          strokeDasharray="128.29446411132812 128.29446411132812"
          strokeWidth="6"
          stroke="#f97316"
          fill="none"
        >
          <animate
            values="0;256.58892822265625"
            keyTimes="0;1"
            dur="1.1764705882352942s"
            repeatCount="indefinite"
            attributeName="stroke-dashoffset"
          ></animate>
        </path>
        <g></g>
      </g>
    </svg>
  );
};

const Loading = () => (
  <main className="bg-white flex-1 py-24">
    <div className={"mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"}>
      <div className="w-full h-full flex items-center justify-center">
        <LoadingIcon />
      </div>
    </div>
  </main>
);

export default Loading;
