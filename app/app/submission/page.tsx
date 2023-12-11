"use client";

import { BsPlusSquare } from "react-icons/bs";
import { Suspense, useState } from "react";
import Link from "next/link";
import SkeletonTable from "@/app/components/skeleton-table";
import queryFetch from "@/app/utils/query-fetch";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/components/loading";
import WarningMessage from "@/app/components/warning-message";
import { ApplicationType } from "@/app/utils/models";
import Pagination from "../components/pagination";
import { dateTimeConverter } from "../utils/common";
import Image from "next/image";
import SkeletonCard from "../components/skeleton-card";
import SubmissionEntriesLoading from "./loading";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export default function Submission() {
  const [pageNumber, setPageNumber] = useState(1);
  const [showLimit, setShowLimit] = useState(12);

  const { isLoading, data } = useQuery({
    queryKey: ["application", pageNumber, showLimit],
    queryFn: () =>
      queryFetch(`/api/v1/applications/?page=${pageNumber}&limit=${showLimit}`),
  });

  if (isLoading) {
    return <SubmissionEntriesLoading />;
  }

  return (
    <>
      <div className="mb-5 mt-7">
        <div className="flex w-full flex-wrap justify-evenly gap-y-7">
          {data?.data.map((app: ApplicationType) => (
            <ApplicationList
              key={app.id}
              app={app}
              showLimit={showLimit}
              pageNumber={pageNumber}
            />
          ))}
        </div>
      </div>
      <Pagination
        dataCount={data?.metadata?.count}
        limit={data?.metadata?.limit}
        pageNumber={data?.metadata?.page}
        setPageNumber={setPageNumber}
      />
      <WarningMessage message={data?.message} />
    </>
  );
}

function ApplicationList({
  app,
  showLimit,
  pageNumber,
}: {
  app: ApplicationType;
  showLimit: number;
  pageNumber: number;
}) {
  function imageSource() {
    if (app?.thumbnail) {
      return <Image src={`${base_url}${app.thumbnail}`} alt="thumbnail" fill />;
    } else {
      return (
        <Image src={`${base_url}/assets/default.png`} alt="thumbnail" fill />
      );
    }
  }
  return (
    <div className="lg:w-[23%] md:w-[32%] w-[90%] bg-white border-2 border-b-4 border-black rounded-ss-2xl rounded-br-2xl shadow-md p-3 h-60 relative">
      <Link href={"/submission/" + app.id}>
        <div className="absolute right-0 h-40 w-52 flex">{imageSource()}</div>
        <div className="absolute bottom-3">
          <p className="text-black text-xl font-semibold">{app.name}</p>
        </div>
      </Link>
    </div>
  );
}

// const LoadingSkeleton = () => {
//   const data = [1, 2, 3, 4, 5, 6, 7, 8];
//   return (
//     <div className="flex w-full flex-wrap justify-evenly gap-y-7 mb-5 mt-7">
//       {data.map((i) => (
//         <div
//           key={i}
//           role="status"
//           className="lg:w-[23%] md:w-[32%] w-[90%] relative p-4 border-2 border-gray-300 rounded animate-pulse md:p-6 dark:border-gray-700 rounded-ss-2xl rounded-br-2xl shadow-md"
//         >
//           <div className="right-0 h-40 w-full flex justify-end">
//             {/* <Image
//               src={`${base_url}/assets/default.png`}
//               alt="thumbnail"
//               fill
//             /> */}
//             <svg
//               className="w-32 h-32 text-gray-300 dark:text-gray-600"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 16 20"
//             >
//               <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
//               <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
//             </svg>
//           </div>
//           <div>
//             <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-5/6"></div>
//             <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700"></div>
//           </div>
//           <span className="sr-only">Loading...</span>
//         </div>
//       ))}
//     </div>
//   );
// };
