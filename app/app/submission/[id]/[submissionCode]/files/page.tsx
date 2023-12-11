"use client";

import queryFetch from "@/app/utils/query-fetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import WarningMessage from "@/app/components/warning-message";
import { FieldType, FileType, FormType, ServiceType } from "@/app/utils/models";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import mutationFetch from "@/app/utils/mutation-fetch";
import ConfirmModal from "@/app/components/confirm-modal";
import Link from "next/link";
import formdataFetch from "@/app/utils/formdata-fetch";
import TextContent from "@/app/components/text-content";
import SubmissionResponseLoading from "../loading";
const base_url = process.env.NEXT_PUBLIC_BASE_URL;

interface FormResponse {
  submissionFormId: number;
  fieldId: number;
  value: string;
  messageId: number;
  createdAt: string;
  updatedAt: string;
}

export default function SubmissionFilesResponse() {
  const params = useParams();

  const queryParams = useSearchParams();
  const router = useRouter();

  const { isLoading, data } = useQuery({
    queryKey: ["application", { id: params?.id }],
    queryFn: () => queryFetch(`/api/v1/applications/${params?.id}`),
  });
  if (isLoading) {
    return <SubmissionResponseLoading />;
  }

  const formIndex = Number(queryParams.get("formIndex"));

  // function handleNextSection() {
  //   if (data?.data.forms.length > formIndex + 1) {
  //     router.push(
  //       `/submission/${data?.data.id}/${
  //         params?.submissionCode
  //       }/forms?formIndex=${formIndex + 1}`
  //     );
  //   } else {
  //     router.push(`/submission/${"UserId"}`);
  //   }
  // }

  function handleNextSection() {
    router.push(`/submission/user?status=`);
  }

  function handleSelectForm(formIndex: number) {
    router.push(
      `/submission/${data?.data.id}/${params?.submissionCode}/files?formIndex=${formIndex}`
    );
  }

  // function handlePreviousSection() {
  //   if (formIndex > 0) {
  //     router.push(
  //       `/submission/${data?.data.id}/${
  //         params?.submissionCode
  //       }/forms?formIndex=${formIndex - 1}`
  //     );
  //   } else {
  //     console.log("AT THE INDEX PAGES");

  //     // router.push("/submission/" + data?.data.id);
  //   }
  // }

  return (
    <>
      <div className="mb-5 mt-7 text-black">
        <div>
          <p className="text-xl font-semibold text-center">
            {data?.data?.name}
          </p>
        </div>
        <div>
          <div className="max-w-sm mx-auto mt-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Jenis Pelayanan
            </label>
            <select
              id="select-services"
              onChange={(e) => handleSelectForm(Number(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {data?.data?.services?.map((serv: FormType, i: number) => (
                <option key={serv.id} value={i}>
                  {serv.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <FilesInput
          key={data?.data?.services[formIndex]?.id}
          form={data?.data?.services[formIndex]}
          handleNextSection={handleNextSection}
        />
      </div>

      <WarningMessage message={data?.message} />
    </>
  );
}

function FilesInput({
  form,
  handleNextSection,
}: {
  form: ServiceType;
  handleNextSection(): void;
}) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const param = useParams();

  // function handleUpdateResponse(field: FieldType, value: string) {
  //   setResponses((current) => {
  //     current[field.order - 1] = {
  //       // id: current[field.order - 1]?.id,
  //       formFieldId: field.id!,
  //       value,
  //     };
  //     return [...current];
  //   });
  // }

  async function handleSubmitResponse() {
    const requestBody = {
      submissionCode: param?.submissionCode,
      serviceFormId: form.id,
    };

    return await mutationFetch("/api/v1/file-responses/", requestBody, "POST");
  }

  const submitResponseMutation = useMutation({
    mutationFn: handleSubmitResponse,
    onSuccess: (res) => {
      setOpenConfirmModal(false);
      if (res.data?.message) {
        handleNextSection();
      }
    },
  });

  // function handleRenderFileForm(field: FieldType) {
  //   return (
  //     <div key={field.id} className="mb-3 md:w-[49%] w-full">
  //       <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
  //         {field.name}{" "}
  //         {field.isRequired ? <span className="text-red-700">*</span> : null}
  //       </label>
  //       <input
  //         onChange={(e) => handleUpdateResponse(field, e.target.value)}
  //         type="file"
  //         id={field.name}
  //         className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
  //       />
  //     </div>
  //   );
  // }

  function handleRenderFileForm(field: ServiceType) {
    return (
      <div key={field.id} className="mb-3 md:w-[49%] w-full">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {field.name}{" "}
          {field.isRequired ? <span className="text-red-700">*</span> : null}
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="user_avatar_help"
          id="user_avatar"
          type="file"
        />
      </div>
    );
  }
  return (
    <>
      <div className="text-black mt-7 border-2 rounded-xl border-gray-300">
        <div className="bg-gradient-to-r from-red-800 to-red-500 text-white rounded-t-xl p-2.5 text-base font-semibold">
          <p>{form?.name}</p>
        </div>
        <div className="mx-3 mt-3 flex flex-wrap gap-3">
          {form?.files.map((field) => (
            <FilesFormField
              key={field.id}
              field={field}
              formId={form.id}
              submissionCode={param?.submissionCode as string}
            />
          ))}
        </div>
      </div>
      <div className="mt-5">
        <p className="mb-2">Penjelasan: </p>
        <TextContent content={form.stepsInfo} />
      </div>
      <div className="flex w-full md:justify-center justify-between my-5">
        <button
          onClick={() => setOpenConfirmModal(true)}
          className="md:px-20 px-8 py-2 bg-gradient-to-r from-red-900 to-red-600 rounded-lg text-white font-semibold text-xl"
        >
          Simpan
        </button>
      </div>
      {openConfirmModal ? (
        <ConfirmModal
          handleSubmit={submitResponseMutation}
          title="Simpan Perubahan?"
          message="Pastikan anda mengisi files sesuai dengan arahan!"
          setConfirmModal={setOpenConfirmModal}
        />
      ) : null}
      {submitResponseMutation.data?.message ? (
        <WarningMessage message={submitResponseMutation.data?.message} />
      ) : null}
    </>
  );
}

const FilesFormField = ({
  field,
  submissionCode,
  formId,
}: {
  field: FileType;
  formId: number;
  submissionCode: string;
}) => {
  // const [fileResponse, setFileResponse] = useState<string | null>(null);
  const [fileResponseEntries, setFileResponseEntries] =
    useState<FileList | null>(null);

  async function handleSubmitFileResponse() {
    const requestBody = new FormData();

    if (fileResponseEntries?.length) {
      requestBody.append("submissionCode", submissionCode);
      requestBody.append("serviceFormId", String(formId));
      requestBody.append("serviceFieldId", String(field.id));
      requestBody.append("value", fileResponseEntries[0]);

      return await formdataFetch("/api/v1/file-responses/", requestBody, "PUT");
    }
  }

  const fileResponseMutation = useMutation({
    mutationFn: handleSubmitFileResponse,
    onSuccess: (res) => {
      console.log("RESULT", res);
      setFileResponseEntries(null);
    },
  });

  function renderButton() {
    if (fileResponseEntries?.length) {
      return (
        <button
          type="button"
          onClick={() => fileResponseMutation.mutate()}
          className="bg-orange-500 py-1.5 px-3 rounded-lg text-white font-semibold"
        >
          Submit
        </button>
      );
    }
    // if (fileResponse) {
    //   return (
    //     <Link
    //       href={`${base_url}${fileResponse}`}
    //       type="button"
    //       className="bg-red-800 py-1.5 px-3 rounded-lg text-white font-semibold"
    //     >
    //       Preview
    //     </Link>
    //   );
    // }

    return (
      <button
        type="button"
        disabled
        className="bg-gray-500 bg-opacity-50 py-1.5 px-3 rounded-lg text-white font-semibold"
      >
        Submit
      </button>
    );
  }
  return (
    <>
      <div className="flex gap-3 mb-3 md:w-[49%] w-full items-center">
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {field.name}{" "}
            {field.isRequired ? <span className="text-red-700">*</span> : null}
          </label>
          <input
            onChange={(e) => setFileResponseEntries(e.target.files)}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            type="file"
          />
        </div>
        <div className="flex gap-2 mt-6">{renderButton()}</div>
      </div>
      {fileResponseMutation.data?.message ? (
        <WarningMessage message={fileResponseMutation.data?.message} />
      ) : null}
    </>
  );
};

// const LoadingSkeleton = () => {
//   return (
//     <>
//       <div className="mb-5 mt-7 text-black">
//         <div className="flex justify-center">
//           <div className="animate-pulse h-3 bg-gray-300 rounded-full dark:bg-gray-700 w-1/5 md:mb-4"></div>
//         </div>
//       </div>
//       <div className="text-black mt-7 border-2 rounded-xl border-gray-300">
//         <div className="bg-gradient-to-r from-red-800 to-red-500 text-white rounded-t-xl p-2.5 text-base font-semibold">
//           <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 md:w-3/12 w-6/12 md:mb-4 animate-pulse"></div>
//         </div>
//         <div className="mx-3 mt-3 flex flex-wrap gap-3 animate-pulse">
//           <div className="mb-3 md:w-[49%] w-full">
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//               <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 md:w-5/12 w-7/12 md:mb-4"></div>
//             </label>
//             <input
//               type="text"
//               className="bg-gray-200 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
//             />
//           </div>
//           <div className="mb-3 md:w-[49%] w-full">
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//               <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 md:w-5/12 w-7/12 md:mb-4"></div>
//             </label>
//             <input
//               type="text"
//               className="bg-gray-200 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
//             />
//           </div>
//           <div className="mb-3 md:w-[49%] w-full">
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//               <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 md:w-5/12 w-7/12 md:mb-4"></div>
//             </label>
//             <input
//               type="text"
//               className="bg-gray-200 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
//             />
//           </div>
//           <div className="mb-3 md:w-[49%] w-full">
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//               <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 md:w-5/12 w-7/12 md:mb-4"></div>
//             </label>
//             <input
//               type="text"
//               className="bg-gray-200 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
//             />
//           </div>
//           <div className="mb-3 md:w-[49%] w-full">
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//               <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 md:w-5/12 w-7/12 md:mb-4"></div>
//             </label>
//             <input
//               type="text"
//               className="bg-gray-200 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
//             />
//           </div>
//           <div className="mb-3 md:w-[49%] w-full">
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//               <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 md:w-5/12 w-7/12 md:mb-4"></div>
//             </label>
//             <input
//               type="text"
//               className="bg-gray-200 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
//             />
//           </div>
//           <div className="mb-3 md:w-[49%] w-full">
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//               <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 md:w-5/12 w-7/12 md:mb-4"></div>
//             </label>
//             <input
//               type="text"
//               className="bg-gray-200 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
//             />
//           </div>
//           <div className="mb-3 md:w-[49%] w-full">
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//               <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-700 md:w-5/12 w-7/12 md:mb-4"></div>
//             </label>
//             <input
//               type="text"
//               className="bg-gray-200 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex w-full md:justify-center justify-between md:gap-11 my-5">
//         <button className="md:px-20 px-8 py-2 bg-gradient-to-r from-red-900 to-red-600 rounded-lg text-white font-semibold text-xl">
//           Lanjut
//         </button>
//       </div>
//     </>
//   );
// };
