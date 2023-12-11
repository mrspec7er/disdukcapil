"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { BsPlusSquare, BsTrash } from "react-icons/bs";
import Loading from "@/app/components/loading";
import AlertMessage from "@/app/components/alert-message";
import mutationFetch from "@/app/utils/mutation-fetch";
import TextEditor from "@/app/components/text-editor";
import { FileType, ServiceType } from "@/app/utils/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import WarningMessage from "@/app/components/warning-message";

export function ApplicationServiceMutation({ serv }: { serv?: ServiceType }) {
  const [message, setMessage] = useState("");

  const [name, setName] = useState(serv?.name ?? "");
  const [stepsInfo, setStepsInfo] = useState(serv?.stepsInfo ?? "");
  const [files, setFiles] = useState<FileType[]>(serv?.files ?? []);
  const [activeDeleteButton, setActiveDeleteButton] = useState<null | number>(
    null
  );

  async function handleAddField() {
    setFiles((current) => {
      return [
        ...current,
        {
          name: "",
          isRequired: true,
          order: (current[current.length - 1]?.order ?? 0) + 1,
        },
      ];
    });
  }

  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();

  async function handleSubmitService() {
    const requestBody = {
      id: serv?.id,
      applicationId: Number(params?.id),
      name,
      files,
      stepsInfo,
    };

    return await mutationFetch("/api/v1/services/", requestBody, "PUT");
  }

  const serviceMutation = useMutation({
    mutationFn: handleSubmitService,
    onSuccess: (res) => {
      if (res.data?.id) {
        router.push(`/admin/applications/${params?.id}?section=service`);
        queryClient.invalidateQueries({ queryKey: ["service"] });
      }
    },
  });

  if (serviceMutation.isPending) {
    return <Loading />;
  }
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-500">
            Nama Pelayanan
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        {files.map((file) => (
          <CurrentFile
            key={file.order}
            file={file}
            activeDeleteButton={activeDeleteButton}
            setActiveDeleteButton={setActiveDeleteButton}
            setFiles={setFiles}
          />
        ))}

        <div className="w-full flex items-center justify-end md:mt-7 px-12">
          <button
            type="button"
            onClick={() => handleAddField()}
            className="text-5xl text-red-800"
          >
            <BsPlusSquare />
          </button>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-base text-gray-500 font-medium">
            Persyaratan
          </label>
          <TextEditor content={stepsInfo} setContent={setStepsInfo} />
        </div>

        <div className="mb-2 mt-12 w-3/12 mx-auto">
          <button
            onClick={() => serviceMutation.mutate()}
            type="button"
            className="w-full border-gray-300 bg-red-800 py-2 rounded-md text-white font-bold text-xl"
          >
            Submit
          </button>
        </div>
      </form>
      {serviceMutation.data?.message ? (
        <WarningMessage message={serviceMutation.data?.message} />
      ) : null}
    </>
  );
}

function CurrentFile({
  file,
  activeDeleteButton,
  setActiveDeleteButton,
  setFiles,
}: {
  file: FileType;
  setFiles: Dispatch<SetStateAction<FileType[]>>;
  activeDeleteButton: number | null;
  setActiveDeleteButton: Dispatch<SetStateAction<number | null>>;
}) {
  async function handleUpdateFileName(fileName: string) {
    setFiles((current) => {
      return current.map((val) => {
        if (val.order !== file.order) {
          return val;
        } else {
          return {
            ...val,
            name: fileName,
          };
        }
      });
    });
  }
  async function handleUpdateFileRequiredStatus(isRequired: boolean) {
    setFiles((current) => {
      return current.map((val) => {
        if (val.order !== file.order) {
          return val;
        } else {
          return {
            ...val,
            isRequired,
          };
        }
      });
    });
  }

  async function handleDeleteFile() {
    setFiles((current) => current.filter((val) => val.order !== file.order));
    if (file.id) {
      await mutationFetch("/api/v1/services/files/" + file.id, {}, "DELETE");
    }
  }
  return (
    <div className="mb-6">
      <div className="text-sm text-gray-700">
        <div className="mb-2 flex md:flex-row flex-col justify-between items-center md:gap-5 gap-2">
          <div className="w-full">
            <label className="block mb-2 text-sm text-gray-500 font-medium">
              Nama Persyaratan
            </label>
            <input
              type="text"
              value={file.name}
              onChange={(e) => handleUpdateFileName(e.target.value)}
              className="bg-gray-50 border-2 rounded-lg block w-full p-2.5 border-gray-300"
            />
          </div>
          <div className="flex md:w-3/6 w-full items-center ml-1 mt-3.5">
            <div className="flex md:w-1/3 w-full items-center ml-1">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={file.isRequired}
                  onChange={(e) =>
                    handleUpdateFileRequiredStatus(e.target.checked)
                  }
                  readOnly
                  className="w-4 h-4 border-2 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                />
              </div>
              <label className="ms-2 font-medium text-gray-900 dark:text-gray-300">
                Wajib
              </label>
            </div>
            <div className="md:w-2/6 w-full flex justify-center items-center relative mt-3">
              {activeDeleteButton === file.order ? (
                <button
                  onClick={() => handleDeleteFile()}
                  type="button"
                  className="font-medium w-16 text-red-500 ms-3 border-2 p-2 rounded-md border-red-300 hover:bg-red-100"
                >
                  Hapus
                </button>
              ) : (
                <button
                  onClick={() => setActiveDeleteButton(file.order)}
                  type="button"
                  className="text-xl text-red-800 hover:scale-125 ml-3"
                >
                  <BsTrash />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
