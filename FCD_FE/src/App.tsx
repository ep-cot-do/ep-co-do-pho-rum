import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center h-screen">
        <div className="flex flex-row justify-between gap-10">
          <div className="w-1/2">
            <img src={reactLogo} alt="React Logo" className="h-48" />
          </div>
          <div className="w-1/2">
            <img src={viteLogo} alt="Vite Logo" className="h-48" />
          </div>

          <div className="w-full">
            <h1 className="text-4xl font-bold text-center">
              Vite + React + Tailwind CSS Boilerplate for FCoder Website
            </h1>
            <div className="text-center py-5">
              <button
                onClick={() => {
                  setCount((count) => count + 1);
                }}
                className="px-4 py-2 bg-red-100 font-bold text-red-400 rounded-sm"
              >
                count is {count}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
