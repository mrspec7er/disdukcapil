const SubmissionDetailLoading = () => {
  return (
    <div className="text-black mb-5 mt-7">
      <div className="flex flex-col md:flex-row w-full gap-3">
        <div className="bg-white animate-pulse md:w-2/3 lg:w-1/3 w-full border-2 border-b-4 rounded-ss-2xl rounded-br-2xl shadow-md p-3 h-60 relative">
          <div className="absolute right-0 h-40 w-52 flex">
            <svg
              className="w-full h-full text-gray-300 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
          <div className="absolute bottom-2">
            <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-700 w-60 mb-2"></div>
          </div>
        </div>
        <div className="w-full border-2 border-b-4 rounded-xl">
          <div className="bg-gradient-to-r from-red-800 to-red-500 text-white rounded-t-xl p-3 text-lg font-semibold">
            <p>Pemohon akan mendapatkan</p>
          </div>
          <ul className="mx-9 mt-3">
            <li>
              <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-700 md:w-1/12 w-1/3 md:mb-5"></div>
            </li>
            <li>
              <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-700 md:w-2/12 w-2/3 md:mb-5"></div>
            </li>
            <li>
              <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-700 md:w-3/12 w-5/6 md:mb-5"></div>
            </li>
            <li>
              <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-700 md:w-3/12 w-5/6 md:mb-5"></div>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full border-2 border-b-4 rounded-xl mt-3">
        <div className="bg-gradient-to-r from-red-800 to-red-500 text-white rounded-t-xl p-3 text-lg font-semibold">
          <p>Syarat - syarat permohonan</p>
        </div>
        <div>
          <div role="status" className="animate-pulse p-5">
            <div className="h-5 bg-gray-300 rounded-full dark:bg-gray-700 md:w-[15vw] w-[45vw] mb-6 mt-2"></div>
            <div className="h-5 bg-gray-300 rounded-full dark:bg-gray-700 mb-7 md:w-[25vw] w-[55vw]"></div>
            <div className="h-5 bg-gray-300 rounded-full dark:bg-gray-700 md:w-[25vw] w-[55vw] mb-6 mt-2"></div>
            <div className="h-5 bg-gray-300 rounded-full dark:bg-gray-700 md:w-[35vw] w-[75vw] mb-7"></div>
            <div className="h-5 bg-gray-300 rounded-full dark:bg-gray-700 md:w-[50vw] w-[80vw] mb-7"></div>
            <div className="h-5 bg-gray-300 rounded-full dark:bg-gray-700 md:w-[50vw] w-[80vw] "></div>

            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailLoading;
