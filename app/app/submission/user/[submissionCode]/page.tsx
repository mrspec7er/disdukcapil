"use client";

import queryFetch from "@/app/utils/query-fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WarningMessage from "@/app/components/warning-message";
import {
  SubmissionFileResponseType,
  SubmissionFormType,
  SubmissionResponseType,
  SubmissionServiceType,
} from "@/app/utils/models";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import mutationFetch from "@/app/utils/mutation-fetch";
import ConfirmModal from "@/app/components/confirm-modal";
import Link from "next/link";
import formdataFetch from "@/app/utils/formdata-fetch";
import UserSubmissionLoading from "../loading";
const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export default function SubmissionFormUpdateResponse() {
  const params = useParams();

  const queryParams = useSearchParams();
  const router = useRouter();

  const { isLoading, data } = useQuery({
    queryKey: ["submission", { id: params?.id }],
    queryFn: () =>
      queryFetch(`/api/v1/submissions/user/${params?.submissionCode}`),
  });
  if (isLoading) {
    return <UserSubmissionLoading />;
  }

  const submissionFormIndex = Number(queryParams.get("submissionFormIndex"));
  const submissionType = queryParams.get("submissionType");

  function handleNextSection() {
    if (
      data?.data.submissionForms?.length > submissionFormIndex + 1 &&
      submissionType === "FORM"
    ) {
      return router.push(
        `/submission/user/${
          params?.submissionCode
        }?submissionType=FORM&submissionFormIndex=${submissionFormIndex + 1}`
      );
    }

    if (
      data?.data.submissionForms?.length <= submissionFormIndex + 1 &&
      submissionType === "FORM"
    ) {
      return router.push(
        `/submission/user/${params?.submissionCode}?submissionType=FILE&submissionFormIndex=0`
      );
    }

    if (
      data?.data.submissionServices?.length > submissionFormIndex + 1 &&
      submissionType === "FILE"
    ) {
      return router.push(
        `/submission/user/${
          params?.submissionCode
        }?submissionType=FILE&submissionFormIndex=${submissionFormIndex + 1}`
      );
    }
    return router.push("/submission/user?status=");
  }

  function handlePreviousSection() {
    if (submissionFormIndex > 0 && submissionType === "FORM") {
      return router.push(
        `/submission/user/${
          params?.submissionCode
        }?submissionType=FORM&submissionFormIndex=${submissionFormIndex - 1}`
      );
    }

    if (submissionFormIndex <= 0 && submissionType === "FILE") {
      return router.push(
        `/submission/user/${
          params?.submissionCode
        }?submissionType=FORM&submissionFormIndex=${
          data?.data.submissionForms?.length - 1
        }`
      );
    }

    if (submissionFormIndex > 0 && submissionType === "FILE") {
      return router.push(
        `/submission/user/${
          params?.submissionCode
        }?submissionType=FILE&submissionFormIndex=${submissionFormIndex - 1}`
      );
    }

    return router.push("/submission/user?status=");
  }

  return (
    <>
      <div className="mb-5 mt-7 text-black">
        <div>
          <p className="text-xl font-semibold text-center">
            {data?.data?.application.name}
          </p>
        </div>
        {submissionType === "FORM" ? (
          <FormResponse
            key={data?.data?.submissionForms[submissionFormIndex]?.id}
            submissionForm={data?.data?.submissionForms[submissionFormIndex]}
            submissionFormIndex={submissionFormIndex}
            handleNextSection={handleNextSection}
            handlePreviousSection={handlePreviousSection}
          />
        ) : (
          <FileResponse
            key={data?.data?.submissionServices[submissionFormIndex]?.id}
            submissionFile={data?.data?.submissionServices[submissionFormIndex]}
            submissionFormIndex={submissionFormIndex}
            handleNextSection={handleNextSection}
            handlePreviousSection={handlePreviousSection}
          />
        )}
      </div>

      <WarningMessage message={data?.message} />
    </>
  );
}

function FormResponse({
  submissionForm,
  submissionFormIndex,
  handleNextSection,
  handlePreviousSection,
}: {
  submissionForm: SubmissionFormType;
  submissionFormIndex: number;
  handleNextSection(): void;
  handlePreviousSection(): void;
}) {
  const [responses, setResponses] = useState<SubmissionResponseType[]>(
    submissionForm?.responses
  );
  const [confirmModal, setConfirmModal] = useState(false);

  const param = useParams();
  const queryClient = useQueryClient();

  function handleUpdateResponse(
    responseEntry: SubmissionResponseType,
    value: string
  ) {
    setResponses((current) => {
      return current.map((response) => {
        if (response.id !== responseEntry.id) {
          return response;
        } else {
          return {
            ...response,
            value,
          };
        }
      });
    });
  }

  async function handleUploadFormResponse() {
    const responseEntries = responses.map((res) => ({
      id: res.id,
      value: res.value,
      formFieldId: res.formFieldId,
    }));
    const requestBody = {
      id: submissionForm.id,
      formId: submissionForm.formId,
      submissionCode: param?.submissionCode,
      responses: responseEntries,
    };

    return await mutationFetch("/api/v1/responses/", requestBody, "PUT");
  }

  const uploadResponseMutation = useMutation({
    mutationFn: handleUploadFormResponse,
    onSuccess: (res) => {
      console.log("RESULT", res);
      if (res.data?.id) {
        queryClient.invalidateQueries({ queryKey: ["submission"] });
        setConfirmModal(false);
        // handleNextSection();
      }
    },
  });

  function handleRenderResponse(response: SubmissionResponseType) {
    if (response.formField?.type === "TEXT") {
      return (
        <div key={response.formField.id} className="mb-3 md:w-[49%] w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {response.formField.name}{" "}
            {response.formField.isRequired ? (
              <span className="text-red-600">*</span>
            ) : null}
          </label>
          <input
            onChange={(e) => handleUpdateResponse(response, e.target.value)}
            defaultValue={response.value}
            type="text"
            id={response.formField.name}
            className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>
      );
    }
    if (response.formField?.type === "NUMBER") {
      return (
        <div key={response.formField.id} className="mb-3 md:w-[49%] w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {response.formField.name}
          </label>
          <input
            onChange={(e) => handleUpdateResponse(response, e.target.value)}
            type="number"
            defaultValue={Number(response.value)}
            id={response.formField.name}
            className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>
      );
    }
    if (response.formField?.type === "DATE") {
      return (
        <div key={response.formField.id} className="mb-3 md:w-[49%] w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {response.formField.name}
          </label>
          <input
            onChange={(e) => handleUpdateResponse(response, e.target.value)}
            type="date"
            defaultValue={response.value}
            id={response.formField.name}
            className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>
      );
    }
    if (response.formField?.type === "TIME") {
      return (
        <div key={response.formField.id} className="mb-3 md:w-[49%] w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {response.formField.name}
          </label>
          <input
            onChange={(e) => handleUpdateResponse(response, e.target.value)}
            type="time"
            defaultValue={response.value}
            id={response.formField.name}
            className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          />
        </div>
      );
    }
    if (response.formField?.type === "SELECT") {
      return (
        <div key={response.formField.id} className="mb-3 md:w-[49%] w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {response.formField.name}
          </label>
          <select
            id={response.formField.name}
            onChange={(e) => handleUpdateResponse(response, e.target.value)}
            defaultValue={response.value}
            className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          >
            {response.formField.options.map((opt) => (
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
          <p>{submissionForm?.form?.name}</p>
        </div>
        <div className="mx-3 mt-3 flex flex-wrap gap-3">
          {submissionForm?.responses.map((response) =>
            handleRenderResponse(response)
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between md:gap-11 gap-3 my-5 mb-20">
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Catatan
          </label>
          <textarea
            id="message"
            cols={52}
            rows={4}
            readOnly
            value={
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus nobis modi ut sed animi nulla?"
            }
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>
        </div>
        <div className="flex justify-end w-full">
          {!uploadResponseMutation.isPending ? (
            <button
              type="button"
              onClick={() => setConfirmModal(true)}
              className="md:px-14 px-8 py-2 bg-gradient-to-r from-gray-500 to-orange-900 h-min rounded-lg text-white font-semibold text-xl"
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="md:px-14 px-8 py-2 animate-pulse bg-gradient-to-r from-gray-500 to-orange-900 h-min rounded-lg text-white font-semibold text-xl"
            >
              Loading...
            </button>
          )}
          {/* <button
            disabled
            type="button"
            className="md:px-14 px-8 py-2 bg-gray-400 h-min rounded-lg text-white font-semibold text-xl opacity-50"
          >
            Update
          </button> */}
        </div>
      </div>
      <div className="flex w-full md:justify-center justify-between md:gap-11 my-5">
        <button
          onClick={handlePreviousSection}
          className="md:px-20 px-8 py-2 bg-gradient-to-r from-gray-950 to-gray-700 rounded-lg text-white font-semibold text-xl"
        >
          Kembali
        </button>

        <button
          onClick={handleNextSection}
          className="md:px-20 px-8 py-2 bg-gradient-to-r  from-red-900 to-red-600 rounded-lg text-white font-semibold text-xl"
        >
          Lanjut
        </button>
      </div>
      {uploadResponseMutation.data?.message ? (
        <WarningMessage message={uploadResponseMutation.data?.message} />
      ) : null}
      {confirmModal ? (
        <ConfirmModal
          title="Update Permohonan"
          message="Pastikan semua perubahan sesuai dengan catatan yang diberikan verifikator!"
          handleSubmit={uploadResponseMutation}
          setConfirmModal={setConfirmModal}
        />
      ) : null}
    </>
  );
}

function FileResponse({
  submissionFile,
  submissionFormIndex,
  handleNextSection,
  handlePreviousSection,
}: {
  submissionFile: SubmissionServiceType;
  submissionFormIndex: number;
  handleNextSection(): void;
  handlePreviousSection(): void;
}) {
  const [responses, setResponses] = useState<SubmissionFileResponseType[]>(
    submissionFile?.responses
  );
  const [confirmModal, setConfirmModal] = useState(false);

  const param = useParams();
  const queryClient = useQueryClient();

  function handleUpdateResponse(
    responseEntry: SubmissionResponseType,
    value: string
  ) {
    setResponses((current) => {
      return current.map((response) => {
        if (response.id !== responseEntry.id) {
          return response;
        } else {
          return {
            ...response,
            value,
          };
        }
      });
    });
  }

  // async function handleUploadFormResponse() {
  //   const responseEntries = responses.map((res) => ({
  //     id: res.id,
  //     value: res.value,
  //     formFieldId: res.formFieldId,
  //   }));
  //   const requestBody = {
  //     id: submissionForm.id,
  //     formId: submissionForm.formId,
  //     submissionCode: param?.submissionCode,
  //     responses: responseEntries,
  //   };

  //   return await mutationFetch("/api/v1/responses/", requestBody, "PUT");
  // }

  // const uploadResponseMutation = useMutation({
  //   mutationFn: handleUploadFormResponse,
  //   onSuccess: (res) => {
  //     console.log("RESULT", res);
  //     if (res.data?.id) {
  //       queryClient.invalidateQueries({ queryKey: ["submission"] });
  //       setConfirmModal(false);
  //       // handleNextSection();
  //     }
  //   },
  // });

  function handleRenderResponse(response: SubmissionFileResponseType) {
    return (
      <>
        <div className="flex gap-3 mb-3 md:w-[49%] w-full items-center">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {response.serviceFile.name}{" "}
              {response.serviceFile.isRequired ? (
                <span className="text-red-700">*</span>
              ) : null}
            </label>
            <input
              // onChange={(e) => setFileResponseEntries(e.target.files)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="user_avatar_help"
              id="user_avatar"
              type="file"
            />
          </div>
          <div className="flex gap-2 mt-6">
            <Link
              href={`${base_url}${response.value}`}
              target="_blank"
              className="bg-gray-500 bg-opacity-50 py-1.5 px-3 rounded-lg text-white font-semibold"
            >
              Preview
            </Link>
          </div>
        </div>
        {/* {fileResponseMutation.data?.message ? (
          <WarningMessage message={fileResponseMutation.data?.message} />
        ) : null} */}
      </>
    );
  }

  return (
    <>
      <div className="text-black mt-7 border-2 rounded-xl border-gray-300">
        <div className="bg-gradient-to-r from-red-800 to-red-500 text-white rounded-t-xl p-2.5 text-base font-semibold">
          <p>{submissionFile?.service?.name}</p>
        </div>
        <div className="mx-3 mt-3 flex flex-wrap gap-3">
          {submissionFile.responses.map((response) => (
            <FileResponseField
              key={response.id}
              submissionCode={param?.submissionCode as string}
              formId={String(submissionFile.serviceId)}
              response={response}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between md:gap-11 gap-3 my-5 mb-20">
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Catatan
          </label>
          <textarea
            id="message"
            cols={52}
            rows={4}
            readOnly
            value={
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus nobis modi ut sed animi nulla?"
            }
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>
        </div>
        {/* <div className="flex justify-end w-full">
          {!uploadResponseMutation.isPending ? (
            <button
              type="button"
              onClick={() => setConfirmModal(true)}
              className="md:px-14 px-8 py-2 bg-gradient-to-r from-gray-500 to-orange-900 h-min rounded-lg text-white font-semibold text-xl"
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="md:px-14 px-8 py-2 animate-pulse bg-gradient-to-r from-gray-500 to-orange-900 h-min rounded-lg text-white font-semibold text-xl"
            >
              Loading...
            </button>
          )}
          <button
            disabled
            type="button"
            className="md:px-14 px-8 py-2 bg-gray-400 h-min rounded-lg text-white font-semibold text-xl opacity-50"
          >
            Update
          </button>
        </div> */}
      </div>
      <div className="flex w-full md:justify-center justify-between md:gap-11 my-5">
        <button
          onClick={handlePreviousSection}
          className="md:px-20 px-8 py-2 bg-gradient-to-r from-gray-950 to-gray-700 rounded-lg text-white font-semibold text-xl"
        >
          Kembali
        </button>

        <button
          onClick={handleNextSection}
          className="md:px-20 px-8 py-2 bg-gradient-to-r  from-red-900 to-red-600 rounded-lg text-white font-semibold text-xl"
        >
          Lanjut
        </button>
      </div>
      {/* {uploadResponseMutation.data?.message ? (
        <WarningMessage message={uploadResponseMutation.data?.message} />
      ) : null} */}

      {/* {confirmModal ? (
        <ConfirmModal
          title="Update Permohonan"
          message="Pastikan semua perubahan sesuai dengan catatan yang diberikan verifikator!"
          handleSubmit={uploadResponseMutation}
        />
      ) : null} */}
    </>
  );
}

const FileResponseField = ({
  submissionCode,
  formId,
  response,
}: {
  submissionCode: string;
  formId: string;
  response: SubmissionFileResponseType;
}) => {
  const queryClient = useQueryClient();
  const [fileResponseEntries, setFileResponseEntries] =
    useState<FileList | null>(null);

  async function handleSubmitFileResponse() {
    const requestBody = new FormData();

    if (fileResponseEntries?.length) {
      requestBody.append("submissionCode", submissionCode);
      requestBody.append("serviceFormId", String(formId));
      requestBody.append("serviceFieldId", String(response.serviceFileId));
      requestBody.append("value", fileResponseEntries[0]);

      return await formdataFetch("/api/v1/file-responses/", requestBody, "PUT");
    }
  }

  const fileResponseMutation = useMutation({
    mutationFn: handleSubmitFileResponse,
    onSuccess: (res) => {
      setFileResponseEntries(null);
      if (res.data?.id) {
        queryClient.invalidateQueries({ queryKey: ["submission"] });
        // handleNextSection();
      }
    },
  });

  function renderButton() {
    if (fileResponseEntries?.length) {
      return (
        <button
          type="button"
          onClick={() => fileResponseMutation.mutate()}
          className="bg-orange-500 py-1.5 px-3 rounded-lg text-white font-semibold mt-6"
        >
          Submit
        </button>
      );
    }

    return (
      <div className="flex gap-2 mt-6">
        <Link
          href={`${base_url}${response.value}`}
          target="_blank"
          className="bg-gray-500 bg-opacity-50 py-1.5 px-3 rounded-lg text-white font-semibold"
        >
          Preview
        </Link>
      </div>
    );
  }
  return (
    <>
      <div className="flex gap-3 mb-3 md:w-[49%] w-full items-center">
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {response.serviceFile.name}{" "}
            {response.serviceFile.isRequired ? (
              <span className="text-red-700">*</span>
            ) : null}
          </label>
          <input
            onChange={(e) => setFileResponseEntries(e.target.files)}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            type="file"
          />
        </div>
        {renderButton()}
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
