"use client";

import { useParams } from "next/navigation";
import { ApplicationServiceMutation } from "../utils";
import { useQuery } from "@tanstack/react-query";
import queryFetch from "@/app/utils/query-fetch";
import Loading from "@/app/components/loading";

export default function ApplicationServiceUpdate() {
  const params = useParams();

  const { isLoading, data } = useQuery({
    queryKey: ["service", { id: params?.serviceId }],
    queryFn: () => queryFetch(`/api/v1/services/${params?.serviceId}`),
  });

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="border-2 border-red-800 rounded-lg ">
      <div className="bg-red-800 font-semibold p-5 text-xl rounded-t-md rounded-b-sm">
        Edit Pelayanan
      </div>
      <div className="p-5 text-black">
        <ApplicationServiceMutation serv={data?.data} />
      </div>
    </div>
  );
}
