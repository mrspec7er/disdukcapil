"use client";

import { useState } from "react";
import { BsExclamationCircle, BsX } from "react-icons/bs";

export default function WarningMessage({
  message,
}: {
  message: string | undefined;
}) {
  const [warningMessage, setWarningMessage] = useState(message);
  if (!warningMessage) {
    return null;
  }
  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 items-center w-screen bg-black bg-opacity-30 md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            onClick={() => setWarningMessage("")}
            type="button"
            className="absolute top-3 end-2.5 text-2xl text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <BsX />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            <div className="text-5xl text-gray-500 flex justify-center pb-6">
              <BsExclamationCircle />
            </div>
            <h3 className="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">
              {warningMessage}
            </h3>
            <button
              data-modal-hide="popup-modal"
              onClick={() => setWarningMessage("")}
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
