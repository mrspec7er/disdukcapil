"use client";

import queryFetch from "@/app/utils/query-fetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import WarningMessage from "@/app/components/warning-message";
import { FieldType, FormType } from "@/app/utils/models";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import mutationFetch from "@/app/utils/mutation-fetch";
import ConfirmModal from "@/app/components/confirm-modal";
import SubmissionResponseLoading from "../loading";

interface SubmissionForm {
  submissionCode: string;
  formId: number;
  responses: FormResponse[];
  createdAt: string;
  updatedAt: string;
}

interface FormResponse {
  submissionFormId: number;
  fieldId: number;
  value: string;
  messageId: number;
  createdAt: string;
  updatedAt: string;
}

export default function SubmissionFormResponse() {
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

  function handleNextSection() {
    if (data?.data.forms.length > formIndex + 1) {
      return router.push(
        `/submission/${data?.data.id}/${
          params?.submissionCode
        }/forms?formIndex=${formIndex + 1}`
      );
    } else {
      return router.push(
        `/submission/${data?.data.id}/${params?.submissionCode}/files?formIndex=0`
      );
    }
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
        <FormList
          key={data?.data?.forms[formIndex]?.id}
          form={data?.data?.forms[formIndex]}
          handleNextSection={handleNextSection}
        />
      </div>

      <WarningMessage message={data?.message} />
    </>
  );
}

function FormList({
  form,
  handleNextSection,
}: {
  form: FormType;
  handleNextSection(): void;
}) {
  const [responses, setResponses] = useState<
    { id?: number; formFieldId: number; value: string }[]
  >([]);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const param = useParams();

  function handleUpdateResponse(field: FieldType, value: string) {
    setResponses((current) => {
      current[field.order - 1] = {
        // id: current[field.order - 1]?.id,
        formFieldId: field.id!,
        value,
      };
      return [...current];
    });
  }

  async function handleUploadFormResponse() {
    const requestBody = {
      submissionCode: param?.submissionCode,
      formId: form.id,
      responses: responses.filter((res) => res != undefined),
    };

    return await mutationFetch("/api/v1/responses/", requestBody, "POST");
  }

  const uploadResponseMutation = useMutation({
    mutationFn: handleUploadFormResponse,
    onSuccess: (res) => {
      setOpenConfirmModal(false);
      if (res.data?.id) {
        handleNextSection();
      }
    },
  });

  function handleRenderField(field: FieldType) {
    if (field.type === "TEXT") {
      return (
        <div key={field.id} className="mb-3 md:w-[49%] w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {field.name}{" "}
            {field.isRequired ? <span className="text-red-700">*</span> : null}
          </label>
          <input
            onChange={(e) => handleUpdateResponse(field, e.target.value)}
            type="text"
            id={field.name}
            className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>
      );
    }
    if (field.type === "NUMBER") {
      return (
        <div key={field.id} className="mb-3 md:w-[49%] w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {field.name}{" "}
            {field.isRequired ? <span className="text-red-700">*</span> : null}
          </label>
          <input
            onChange={(e) => handleUpdateResponse(field, e.target.value)}
            type="number"
            id={field.name}
            className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>
      );
    }
    if (field.type === "DATE") {
      return (
        <div key={field.id} className="mb-3 md:w-[49%] w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {field.name}{" "}
            {field.isRequired ? <span className="text-red-700">*</span> : null}
          </label>
          <input
            onChange={(e) => handleUpdateResponse(field, e.target.value)}
            type="date"
            id={field.name}
            className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>
      );
    }
    if (field.type === "TIME") {
      return (
        <div key={field.id} className="mb-3 md:w-[49%] w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {field.name}{" "}
            {field.isRequired ? <span className="text-red-700">*</span> : null}
          </label>
          <input
            onChange={(e) => handleUpdateResponse(field, e.target.value)}
            type="time"
            id={field.name}
            className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>
      );
    }
    if (field.type === "SELECT") {
      return (
        <div key={field.id} className="mb-3 md:w-[49%] w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {field.name}{" "}
            {field.isRequired ? <span className="text-red-700">*</span> : null}
          </label>
          <select
            id={field.name}
            onChange={(e) => handleUpdateResponse(field, e.target.value)}
            defaultValue={""}
            className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          >
            <option value="" disabled></option>
            {field.options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }
  }
  return (
    <>
      <div className="text-black mt-7 border-2 rounded-xl border-gray-300">
        <div className="bg-gradient-to-r from-red-800 to-red-500 text-white rounded-t-xl p-2.5 text-base font-semibold">
          <p>{form?.name}</p>
        </div>
        <div className="mx-3 mt-3 flex flex-wrap gap-3">
          {form?.fields.map((field) => handleRenderField(field))}
        </div>
      </div>
      <div className="flex w-full md:justify-center justify-between my-5">
        {/* {formIndex > 0 ? (
          <button
            onClick={handlePreviousSection}
            className="md:px-20 px-8 py-2 bg-gradient-to-r from-gray-950 to-gray-700 rounded-lg text-white font-semibold text-xl"
          >
            Kembali
          </button>
        ) : null} */}
        <button
          onClick={() => setOpenConfirmModal(true)}
          className="md:px-20 px-8 py-2 bg-gradient-to-r from-red-900 to-red-600 rounded-lg text-white font-semibold text-xl"
        >
          Simpan
        </button>
      </div>
      {openConfirmModal ? (
        <ConfirmModal
          handleSubmit={uploadResponseMutation}
          title="Simpan Perubahan?"
          message="Pastikan anda mengisi formulir sesuai dengan arahan!"
          setConfirmModal={setOpenConfirmModal}
        />
      ) : null}
      {uploadResponseMutation.data?.message ? (
        <WarningMessage message={uploadResponseMutation.data?.message} />
      ) : null}
    </>
  );
}

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
