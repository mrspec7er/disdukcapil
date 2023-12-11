"use client";

import { BsPlusSquare } from "react-icons/bs";
import { Suspense, useState } from "react";
import Pagination from "../../components/pagination";
import Link from "next/link";
import SkeletonTable from "@/app/components/skeleton-table";
import queryFetch from "@/app/utils/query-fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/app/components/loading";
import WarningMessage from "@/app/components/warning-message";
import { dateTimeConverter } from "../../utils/common";
import { SubmissionType } from "@/app/utils/models";
import { useSearchParams } from "next/navigation";
import mutationFetch from "@/app/utils/mutation-fetch";
import { useRouter } from "next/router";
import ConfirmModal from "@/app/components/confirm-modal";

export default function User() {
  const [pageNumber, setPageNumber] = useState(1);
  const [showLimit, setShowLimit] = useState(3);

  const queryParams = useSearchParams();
  const submissionStatus = queryParams.get("status");

  const { isLoading, data } = useQuery({
    queryKey: [
      "submission",
      pageNumber,
      showLimit,
      { status: submissionStatus },
    ],
    queryFn: () =>
      queryFetch(
        `/api/v1/submissions/user?page=${pageNumber}&limit=${showLimit}&status=${submissionStatus}`
      ),
  });

  function handleActiveSubmissionStatus(status: string) {
    if (status === submissionStatus) {
      return "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500";
    }

    return "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300";
  }

  return (
    <>
      <div className="flex gap-5 items-center font-bold">
        <p className="text-black text-2xl">Data Permohonan</p>
        <Link
          href={"/submission"}
          className="flex gap-2 items-center rounded-lg bg-red-700 py-1.5 px-3"
        >
          <BsPlusSquare />
          Tambah
        </Link>
      </div>

      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <Link
              href="/submission/user?status="
              className={handleActiveSubmissionStatus("")}
            >
              Semua
            </Link>
          </li>
          <li className="me-2">
            <Link
              href="/submission/user?status=SUBMITTED"
              className={handleActiveSubmissionStatus("SUBMITTED")}
            >
              Diproses
            </Link>
          </li>
          <li className="me-2">
            <Link
              href="/submission/user?status=REJECTED"
              className={handleActiveSubmissionStatus("REJECTED")}
            >
              Ditolak
            </Link>
          </li>
          <li className="me-2">
            <Link
              href="/submission/user?status=REVISED"
              className={handleActiveSubmissionStatus("REVISED")}
            >
              Direvisi
            </Link>
          </li>
          <li className="me-2">
            <Link
              href="/submission/user?status=APPROVED"
              className={handleActiveSubmissionStatus("APPROVED")}
            >
              Disetujui
            </Link>
          </li>
        </ul>
      </div>

      <div className="my-5">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <ApplicationList
            submissions={data?.data}
            showLimit={showLimit}
            pageNumber={pageNumber}
          />
        )}
      </div>
      <Pagination
        dataCount={data?.metadata?.count ?? 10}
        limit={data?.metadata?.limit ?? 10}
        pageNumber={data?.metadata?.page ?? 1}
        setPageNumber={setPageNumber}
      />
      <WarningMessage message={data?.message} />
    </>
  );
}

function ApplicationList({
  submissions,
  showLimit,
  pageNumber,
}: {
  submissions: SubmissionType[];
  showLimit: number;
  pageNumber: number;
}) {
  const queryClient = useQueryClient();

  const [confirmModal, setConfirmModal] = useState(false);
  const [currentActiveSubs, setCurrentActiveSubs] = useState("");

  async function handleRemoveApplication() {
    return await mutationFetch(
      "/api/v1/submissions/user/" + currentActiveSubs,
      {},
      "DELETE"
    );
  }

  const submissionRemoveMutation = useMutation({
    mutationFn: handleRemoveApplication,
    onSuccess: () => {
      setConfirmModal(false);
      setCurrentActiveSubs("");
      queryClient.invalidateQueries({ queryKey: ["submission"] });
    },
  });
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase bg-red-800">
            <tr>
              <th scope="col" className="px-3 py-3">
                No
              </th>
              <th scope="col" className="px-3 py-3">
                Nomor Permohonan
              </th>

              <th scope="col" className="px-3 py-3">
                Jenis Permohonan
              </th>
              <th scope="col" className="px-3 py-3">
                Tanggal Dibuat
              </th>
              <th scope="col" className="px-3 py-3">
                Tanggal Dirubah
              </th>
              <th scope="col" className="px-3 py-3">
                Status
              </th>
              <th scope="col" className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {submissions?.map((sub, i) => (
              <tr
                key={sub.code}
                className="bg-white border-b even:bg-red-100 text-black"
              >
                <th
                  scope="row"
                  className="px-3 py-4 font-medium whitespace-nowrap"
                >
                  {i + (pageNumber - 1) * showLimit + 1}
                </th>
                <th
                  scope="row"
                  className="px-3 py-4 font-medium whitespace-nowrap"
                >
                  {sub.code}
                </th>

                <td className="px-3 py-4 max-sm:min-w-[20rem]">
                  {sub.application.name}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  {dateTimeConverter(sub.createdAt)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  {dateTimeConverter(sub.updatedAt)}
                </td>
                <td className="px-3 py-4 max-sm:min-w-[20rem]">{sub.status}</td>
                <td className="px-3 py-3 flex justify-center gap-3">
                  <div className="border-2 border-blue-500 rounded-md flex justify-center py-2 px-3 w-min">
                    <Link
                      href={`/submission/user/${sub.code}?submissionType=FORM&submissionFormIndex=0`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                  <div className="border-2 border-red-800 text-red-800 rounded-md flex justify-center py-2 px-3 w-min">
                    <button
                      onClick={() => {
                        setConfirmModal(true);
                        setCurrentActiveSubs(sub.code);
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {confirmModal ? (
        <ConfirmModal
          handleSubmit={submissionRemoveMutation}
          message="Pengajuan yang dihapus tidak dapat dipulihkan kembali"
          title="Hapus Pengajuan Permohonan?"
          setConfirmModal={setConfirmModal}
        />
      ) : null}
    </>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-xs uppercase bg-red-800">
          <tr>
            <th scope="col" className="px-3 py-3">
              No
            </th>
            <th scope="col" className="px-3 py-3">
              Nomor Permohonan
            </th>
            <th scope="col" className="px-3 py-3">
              Nama Pemohon
            </th>
            <th scope="col" className="px-3 py-3">
              Jenis Permohonan
            </th>
            <th scope="col" className="px-3 py-3">
              Tanggal Dibuat
            </th>
            <th scope="col" className="px-3 py-3">
              Tanggal Dirubah
            </th>
            <th scope="col" className="px-3 py-3"></th>
          </tr>
        </thead>
        <tbody className="animate-pulse">
          <tr className="bg-white border-b even:bg-red-100 text-black">
            <th scope="row" className="px-3 py-4 font-medium whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mb-2.5"></div>
            </th>
            <th scope="row" className="px-3 py-4 font-medium whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </th>
            <td className="px-3 py-4 max-sm:min-w-[20rem]">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-3">
              <Link
                href={"/"}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <a
                href="#"
                className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
              >
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white border-b even:bg-red-100 text-black">
            <th scope="row" className="px-3 py-4 font-medium whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mb-2.5"></div>
            </th>
            <th scope="row" className="px-3 py-4 font-medium whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </th>
            <td className="px-3 py-4 max-sm:min-w-[20rem]">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-3">
              <Link
                href={"/"}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <a
                href="#"
                className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
              >
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white border-b even:bg-red-100 text-black">
            <th scope="row" className="px-3 py-4 font-medium whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mb-2.5"></div>
            </th>
            <th scope="row" className="px-3 py-4 font-medium whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </th>
            <td className="px-3 py-4 max-sm:min-w-[20rem]">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-3">
              <Link
                href={"/"}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <a
                href="#"
                className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
              >
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white border-b even:bg-red-100 text-black">
            <th scope="row" className="px-3 py-4 font-medium whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mb-2.5"></div>
            </th>
            <th scope="row" className="px-3 py-4 font-medium whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </th>
            <td className="px-3 py-4 max-sm:min-w-[20rem]">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-3">
              <Link
                href={"/"}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <a
                href="#"
                className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
              >
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white border-b even:bg-red-100 text-black">
            <th scope="row" className="px-3 py-4 font-medium whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mb-2.5"></div>
            </th>
            <th scope="row" className="px-3 py-4 font-medium whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </th>
            <td className="px-3 py-4 max-sm:min-w-[20rem]">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            </td>
            <td className="px-3 py-3">
              <Link
                href={"/"}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <a
                href="#"
                className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
              >
                Delete
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
