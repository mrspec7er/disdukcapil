"use client";

import { useQuery } from "@tanstack/react-query";
import { ApplicationFormMutation } from "../utils";
import queryFetch from "@/app/utils/query-fetch";
import { useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function ApplicationFormUpdate() {
  const params = useParams();

  const { isLoading, data } = useQuery({
    queryKey: ["form", { id: params?.formId }],
    queryFn: () => queryFetch(`/api/v1/forms/${params?.formId}`),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="border-2 border-red-800 rounded-lg ">
      <div className="bg-red-800 font-semibold p-5 text-xl rounded-t-md rounded-b-sm">
        Edit Form
      </div>
      <div className="p-5 text-black">
        <ApplicationFormMutation form={data?.data} />
      </div>
    </div>
  );
}
