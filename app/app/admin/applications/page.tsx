"use client";

import { BsPlusSquare } from "react-icons/bs";
import { Suspense, useState } from "react";
import Pagination from "../../components/pagination";
import Link from "next/link";
import SkeletonTable from "@/app/components/skeleton-table";
import queryFetch from "@/app/utils/query-fetch";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/components/loading";
import WarningMessage from "@/app/components/warning-message";
import { dateTimeConverter } from "../../utils/common";
import { ApplicationType } from "@/app/utils/models";

export default function Admin() {
  const [pageNumber, setPageNumber] = useState(1);
  const [showLimit, setShowLimit] = useState(3);

  const { isLoading, data } = useQuery({
    queryKey: ["application", pageNumber, showLimit],
    queryFn: () =>
      queryFetch(`/api/v1/applications/?page=${pageNumber}&limit=${showLimit}`),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex gap-5 items-center font-bold">
        <p className="text-black text-2xl">Master</p>
        <Link
          href={"/admin/applications/mutations"}
          className="flex gap-2 items-center rounded-lg bg-red-700 py-1.5 px-3"
        >
          <BsPlusSquare />
          Tambah
        </Link>
      </div>
      <div className="my-5">
        <Suspense fallback={<SkeletonTable />}>
          <ApplicationList
            applications={data?.data}
            showLimit={showLimit}
            pageNumber={pageNumber}
          />
        </Suspense>
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
  applications,
  showLimit,
  pageNumber,
}: {
  applications: ApplicationType[];
  showLimit: number;
  pageNumber: number;
}) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-xs uppercase bg-red-800">
          <tr>
            <th scope="col" className="px-3 py-3">
              No
            </th>
            <th scope="col" className="px-3 py-3">
              Jenis Prmohonan
            </th>
            <th scope="col" className="px-3 py-3">
              Outcome
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
        <tbody>
          {applications?.map((apc, i) => (
            <tr
              key={apc.id}
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
                {apc.name}
              </th>
              <td className="px-3 py-4 max-sm:min-w-[20rem]">
                {apc.outcomes?.join(", ")}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                {dateTimeConverter(apc.createdAt)}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                {dateTimeConverter(apc.updatedAt)}
              </td>
              <td className="px-3 my-3">
                <div className="flex justify-center border-2 border-blue-500 rounded-md">
                  <Link
                    href={`/admin/applications/${apc.id}?section=index`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline py-1.5"
                  >
                    Detail
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
