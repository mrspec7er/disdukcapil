"use client";

import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import queryFetch from "@/app/utils/query-fetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import WarningMessage from "@/app/components/warning-message";
import { ApplicationType } from "@/app/utils/models";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import TextContent from "@/app/components/text-content";
import mutationFetch from "@/app/utils/mutation-fetch";
import SubmissionDetailLoading from "./loading";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export default function SubmissionDetail() {
  const params = useParams();

  const { isLoading, data } = useQuery({
    queryKey: ["application", { id: params?.id }],
    queryFn: () => queryFetch(`/api/v1/applications/${params?.id}`),
  });

  if (isLoading) {
    return <SubmissionDetailLoading />;
  }

  return (
    <>
      <Link
        className="text-black mt-5 text-lg hover:scale-110 hover:text-red-800"
        href={"/submission"}
      >
        <BsArrowLeft />
      </Link>
      <div className="mt-2">
        <ApplicationDetail key={data?.data.id} app={data?.data} />
      </div>
      <WarningMessage message={data?.message} />
    </>
  );
}

function ApplicationDetail({ app }: { app: ApplicationType }) {
  const router = useRouter();
  function imageSource() {
    if (app?.thumbnail) {
      return <Image src={`${base_url}${app.thumbnail}`} alt="thumbnail" fill />;
    } else {
      return (
        <Image src={`${base_url}/assets/default.png`} alt="thumbnail" fill />
      );
    }
  }

  async function handleCreateSubmission() {
    const requestBody = {
      applicationId: app.id,
    };
    return await mutationFetch("/api/v1/submissions/", requestBody, "PUT");
  }

  const createSubmissionMutation = useMutation({
    mutationFn: handleCreateSubmission,
    onSuccess: (res) => {
      console.log("RESULT", res);

      if (res.data?.code) {
        router.push(
          `/submission/${app.id}/${res.data?.code}/forms?formIndex=0`
        );
      }
    },
  });
  return (
    <div className="text-black">
      <div className="flex flex-col md:flex-row w-full gap-3">
        <div className="bg-white md:w-2/3 lg:w-1/3 w-full border-2 border-b-4 border-gray-300 rounded-ss-2xl rounded-br-2xl shadow-md p-3 h-60 relative">
          <div className="absolute right-0 h-40 w-52 flex">{imageSource()}</div>
          <div className="absolute bottom-3">
            <p className="text-xl font-semibold">{app?.name}</p>
          </div>
        </div>
        <div className="w-full border-2 border-b-4 rounded-xl bg-white">
          <div className="bg-gradient-to-r from-red-800 to-red-500 text-white rounded-t-xl p-3 text-lg font-semibold">
            <p>Pemohon akan mendapatkan</p>
          </div>
          <ul className="ml-9 mt-3 list-decimal">
            {app?.outcomes.map((oct, i) => (
              <li key={oct}>{oct}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full border-2 border-b-4 rounded-xl mt-3">
        <div className="bg-gradient-to-r from-red-800 to-red-500 text-white rounded-t-xl p-3 text-lg font-semibold">
          <p>Syarat - syarat permohonan</p>
        </div>
        <div>
          <TextContent content={app?.requirementInfo} />
        </div>
      </div>
      <div className="flex w-full justify-center gap-11 my-5">
        {!createSubmissionMutation.isPending ? (
          <button
            onClick={() => createSubmissionMutation.mutate()}
            className="md:px-20 px-10 py-3 bg-gradient-to-r from-red-900 to-red-600 hover:brightness-110 hover:scale-105 rounded-lg text-white font-semibold text-xl"
          >
            Ajukan Permohonan
          </button>
        ) : (
          <button className="md:px-20 px-10 py-3 bg-gradient-to-r from-red-900 to-red-600 hover:brightness-110 hover:scale-105 rounded-lg text-white font-semibold text-xl">
            <p className="animate-pulse">Loading...</p>
          </button>
        )}
      </div>
    </div>
  );
}

// const LoadingSkeleton = () => {
//   return (
//     <div className="text-black mb-5 mt-7">
//       <div className="flex flex-col md:flex-row w-full gap-3">
//         <div className="bg-white animate-pulse md:w-2/3 lg:w-1/3 w-full border-2 border-b-4 rounded-ss-2xl rounded-br-2xl shadow-md p-3 h-60 relative">
//           <div className="absolute right-0 h-40 w-52 flex">
//             <svg
//               className="w-full h-full text-gray-300 dark:text-gray-600"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 20 18"
//             >
//               <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
//             </svg>
//           </div>
//           <div className="absolute bottom-0">
//             <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-60 mb-2"></div>
//             <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-60 mb-4"></div>
//           </div>
//         </div>
//         <div className="w-full border-2 border-b-4 rounded-xl">
//           <div className="bg-gradient-to-r from-red-800 to-red-500 text-white rounded-t-xl p-3 text-lg font-semibold">
//             <p>Pemohon akan mendapatkan</p>
//           </div>
//           <ul className="mx-9 mt-3">
//             <li>
//               <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/5 md:mb-4"></div>
//             </li>
//             <li>
//               <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-2/5 md:mb-4"></div>
//             </li>
//             <li>
//               <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-3/5 md:mb-4"></div>
//             </li>
//             <li>
//               <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-2/5 md:mb-4"></div>
//             </li>
//             <li>
//               <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-3/5 md:mb-4"></div>
//             </li>
//           </ul>
//         </div>
//       </div>
//       <div className="w-full border-2 border-b-4 rounded-xl mt-3">
//         <div className="bg-gradient-to-r from-red-800 to-red-500 text-white rounded-t-xl p-3 text-lg font-semibold">
//           <p>Syarat - syarat permohonan</p>
//         </div>
//         <div>
//           <div role="status" className="animate-pulse p-5">
//             <div className="h-3.5 bg-gray-300 rounded-full dark:bg-gray-700 w-[35vw] mb-6 mt-2"></div>
//             <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[35vw] mb-3.5"></div>
//             <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 mb-3.5 w-[45vw]"></div>
//             <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[45vw] mb-3.5"></div>
//             <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[45vw] mb-3.5"></div>
//             <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[55vw]"></div>
//             <div className="h-3.5 bg-gray-300 rounded-full dark:bg-gray-700 w-[55vw] mb-6 mt-2"></div>
//             <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[55vw] mb-3.5"></div>
//             <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 mb-3.5 w-[65vw]"></div>
//             <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[65%] mb-3.5"></div>
//             <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[70vw] mb-3.5"></div>
//             <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[70vw]"></div>

//             <span className="sr-only">Loading...</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
