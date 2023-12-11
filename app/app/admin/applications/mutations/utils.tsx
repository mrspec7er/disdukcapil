"use client";

import { ApplicationType } from "@/app/utils/models";
import TextEditor from "../../../components/text-editor";
import { useState } from "react";
import { BsPlusSquare, BsTrash, BsUpload } from "react-icons/bs";
import Loading from "@/app/components/loading";
import mutationFetch from "@/app/utils/mutation-fetch";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import WarningMessage from "@/app/components/warning-message";
import ConfirmModal from "@/app/components/confirm-modal";

export function ApplicationMutationForm({ apc }: { apc?: ApplicationType }) {
  const [name, setName] = useState(apc?.name ?? "");
  const [outcomes, setOutcomes] = useState<Array<string>>(apc?.outcomes ?? []);
  const [requirementInfo, setRequirementInfo] = useState(
    apc?.requirementInfo ?? ""
  );
  const [outcomeInput, setOutcomeInput] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  async function handleSubmitApplication() {
    const requestBody = {
      id: apc?.id,
      name,
      thumbnail: apc?.thumbnail,
      outcomes,
      requirementInfo,
    };

    return await mutationFetch("/api/v1/applications/", requestBody, "PUT");
  }

  const applicationMutation = useMutation({
    mutationFn: handleSubmitApplication,
    onSuccess: (res) => {
      if (res.data?.id) {
        router.push("/admin/applications");
        queryClient.invalidateQueries({ queryKey: ["application"] });
      }
    },
  });

  async function handleRemoveApplication() {
    return await mutationFetch("/api/v1/applications/" + apc?.id, {}, "DELETE");
  }

  const applicationRemoveMutation = useMutation({
    mutationFn: handleRemoveApplication,
    onSuccess: () => {
      setConfirmModal(false);
      router.push("/admin/applications");
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
  });

  async function handleRemoveOutcome(key: string) {
    setOutcomes((value) => value.filter((val) => val !== key));
  }

  if (applicationMutation.isPending) {
    return <Loading />;
  }

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium">
            Nama Permohonan
          </label>
          <input
            type="text"
            id="nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="mb-1">
          <h2 className=" font-medium text-base dark:text-white">Outcomes:</h2>
          <ul className="max-w-md ml-2 space-y-1 text-gray-500 list-disc list-inside text-base">
            {outcomes.map((ocm, i) => (
              <li
                className="hover:text-red-800 hover:text-lg hover:cursor-pointer flex justify-start items-center gap-5"
                key={i}
              >
                <p>{ocm}</p>
                <div className="hover:text-yellow-400 scale-110">
                  <BsTrash onClick={() => handleRemoveOutcome(ocm)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <div className="flex gap-5 items-center">
            <input
              type="text"
              id="outcomes"
              value={outcomeInput}
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  setOutcomes((val) => [...val, outcomeInput]);
                  setOutcomeInput("");
                }
              }}
              className="bg-gray-50 border border-gray-300 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-1/3 md:w-1/2 p-2.5"
              onChange={(e) => setOutcomeInput(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                setOutcomes((val) => [...val, outcomeInput]);
                setOutcomeInput("");
              }}
              className="text-4xl text-red-800"
            >
              <BsPlusSquare />
            </button>
          </div>
        </div>
        <div className="mb-6 pt-3 rounded-md">
          <label className="block mb-2 text-base font-medium">
            Syarat Permohonan
          </label>
          <TextEditor
            content={requirementInfo}
            setContent={setRequirementInfo}
          />
        </div>
        <div className="my-5 flex justify-between md:mx-32">
          <button
            type="button"
            onClick={() => setConfirmModal(true)}
            className="md:w-1/5 w-1/3 border-gray-300 bg-black py-2 rounded-md text-white font-semibold text-lg"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => applicationMutation.mutate()}
            className="md:w-1/5 w-1/3 border-gray-300 bg-red-800 py-2 rounded-md text-white font-semibold text-lg"
          >
            Submit
          </button>
        </div>
      </form>
      {applicationMutation.data?.message ? (
        <WarningMessage message={applicationMutation.data?.message} />
      ) : null}
      {confirmModal ? (
        <ConfirmModal
          handleSubmit={applicationRemoveMutation}
          message="Data yang dihapus tidak dapat dikembalikan lagi!"
          title="Hapus Permohonan?"
          setConfirmModal={setConfirmModal}
        />
      ) : null}
    </>
  );
}
