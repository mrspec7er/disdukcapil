"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ApplicationMutationForm } from "../mutations/utils";
import { ApplicationType, FormType, ServiceType } from "@/app/utils/models";
import { BsCheck2Square, BsTrash } from "react-icons/bs";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import queryFetch from "@/app/utils/query-fetch";
import Loading from "@/app/components/loading";
import formdataFetch from "@/app/utils/formdata-fetch";
import Image from "next/image";
import mutationFetch from "@/app/utils/mutation-fetch";

export default function ApplicationDetail() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const stateParams = new URLSearchParams(useSearchParams());
  const section = searchParams.get("section");

  function handleSetQueryParams(section: string) {
    stateParams.set("section", section);
    router.push(`?${stateParams}`);
  }

  const { isLoading, data } = useQuery({
    queryKey: ["application"],
    queryFn: () => queryFetch(`/api/v1/applications/${params?.id}`),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="text-black">
      <div className="pb-6">
        <p className="text-xl font-bold py-2">Permohonan</p>

        <ul className="flex flex-wrap text-sm font-semibold text-center text-gray-500 border-b-2 border-gray-300">
          <li className="me-2">
            <button
              onClick={() => handleSetQueryParams("index")}
              aria-current="page"
              className={
                "inline-block p-4 rounded-t-lg hover:text-red-800 " +
                (section === "index" ? "text-red-800 underline active" : null)
              }
            >
              Detail
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => handleSetQueryParams("form")}
              className={
                "inline-block p-4 rounded-t-lg hover:text-red-800 " +
                (section === "form" ? "text-red-800 underline active" : null)
              }
            >
              Form
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => handleSetQueryParams("service")}
              className={
                "inline-block p-4 rounded-t-lg hover:text-red-800 " +
                (section === "service" ? "text-red-800 underline active" : null)
              }
            >
              Pelayanan
            </button>
          </li>
        </ul>
      </div>
      <div>
        <ApplicationSection section={section} applications={data?.data} />
      </div>
    </div>
  );
}

function ApplicationSection({
  section,
  applications,
}: {
  section: string | null;
  applications: ApplicationType;
}) {
  if (section === "index") {
    return (
      <div className="border-4 border-gray-400 border-opacity-30 md:p-10 p-3 rounded-md">
        <UpdateThumbnail app={applications} />
        <ApplicationMutationForm key={applications?.id} apc={applications} />
      </div>
    );
  }
  if (section === "form") {
    return (
      <FormList
        apcForms={applications?.forms}
        applicationId={applications?.id}
      />
    );
  }
  if (section === "service") {
    return (
      <ServiceList
        apcService={applications?.services}
        applicationId={applications.id}
      />
    );
  }
}

function FormList({
  apcForms,
  applicationId,
}: {
  apcForms: FormType[];
  applicationId: number;
}) {
  const [activeButton, setActiveButton] = useState<null | number>(null);
  const queryClient = useQueryClient();

  async function handleDeleteAppForm() {
    return await mutationFetch("/api/v1/forms/" + activeButton, {}, "DELETE");
  }

  const applicationMutation = useMutation({
    mutationFn: handleDeleteAppForm,
    onSuccess: () => {
      setActiveButton(null);
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
  });

  return (
    <div className="border-4 border-gray-400 border-opacity-30 rounded-lg">
      <div className="px-2 bg-white py-5">
        <div className="border-2 border-red-800 text-red-800 w-fit px-3 py-2 mx-3 rounded font-bold">
          <Link href={`/admin/applications/${applicationId}/forms`}>
            Tambah Form
          </Link>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase bg-red-800 text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Nama Form
              </th>
              <th scope="col" className="px-6 py-3">
                Jumlah Kolom
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal Dibuat
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal Dirubah
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {apcForms?.map((form, i) => (
              <tr
                key={form.id}
                className="bg-white border-b even:bg-red-100 text-black"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {i + 1}
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {form.name}
                </th>
                <td className="px-6 py-4">{form.fields?.length}</td>
                <td className="px-6 py-4">{form.createdAt}</td>
                <td className="px-6 py-4">{form.updatedAt}</td>
                <td className="flex my-2">
                  <Link
                    href={`/admin/applications/${applicationId}/forms/${form.id}`}
                  >
                    <button
                      type="button"
                      className="text-lg text-blue-500 border-2 p-2 rounded-md border-blue-300 hover:bg-blue-100"
                    >
                      <BsCheck2Square />
                    </button>
                  </Link>
                  {activeButton === form.id ? (
                    <div className="w-24 flex justify-center">
                      <button
                        type="button"
                        onClick={() => applicationMutation.mutate()}
                        className="font-medium w-16 text-red-500 ms-3 border-2 p-2 rounded-md border-red-300 hover:bg-red-100"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 flex justify-center">
                      <button
                        onClick={() => setActiveButton(form.id)}
                        type="button"
                        className="text-lg text-orange-400 ms-3 border-2 p-2 rounded-md border-orange-300 hover:bg-red-100"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServiceList({
  apcService,
  applicationId,
}: {
  apcService: ServiceType[];
  applicationId: number;
}) {
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const queryClient = useQueryClient();

  async function handleDeleteAppService() {
    return await mutationFetch(
      "/api/v1/services/" + activeButton,
      {},
      "DELETE"
    );
  }

  const applicationMutation = useMutation({
    mutationFn: handleDeleteAppService,
    onSuccess: () => {
      setActiveButton(null);
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
  });
  return (
    <div className="border-4 border-gray-400 border-opacity-30 rounded-lg">
      <div className="px-2 bg-white py-5">
        <div className="border-2 border-red-800 text-red-800 w-fit px-3 py-2 mx-3 rounded font-bold">
          <Link href={`/admin/applications/${applicationId}/services`}>
            Tambah Pelayanan
          </Link>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase bg-red-800 text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama Layanan
              </th>
              <th scope="col" className="px-6 py-3">
                Jumlah Persyaratan
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal Dibuat
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal Dirubah
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {apcService?.map((svc) => (
              <tr
                key={svc.id}
                className="bg-white border-b even:bg-red-100 text-black"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {svc.name}
                </th>
                <td className="px-6 py-4">{svc.files.length}</td>
                <td className="px-6 py-4">{svc.createdAt}</td>
                <td className="px-6 py-4">{svc.updatedAt}</td>
                <td className="flex my-2">
                  <Link
                    href={`/admin/applications/${applicationId}/services/${svc.id}`}
                  >
                    <button
                      type="button"
                      className="text-lg flex justify-center text-blue-500 border-2 p-2 rounded-md border-blue-300 hover:bg-blue-100"
                    >
                      <BsCheck2Square />
                    </button>
                  </Link>
                  {activeButton === svc.id ? (
                    <div className="w-24 flex justify-center">
                      <button
                        onClick={() => applicationMutation.mutate()}
                        type="button"
                        className="font-medium w-16 text-orange-400 ms-3 border-2 p-2 rounded-md border-orange-300 hover:bg-red-100"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 flex justify-center">
                      <button
                        onClick={() => setActiveButton(svc.id)}
                        type="button"
                        className="text-lg text-red-500 ms-3 border-2 p-2 rounded-md border-red-300 hover:bg-red-100"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UpdateThumbnail({ app }: { app: ApplicationType }) {
  const [thumbnailEntries, setThumbnailEntries] = useState<FileList | null>(
    null
  );
  const queryClient = useQueryClient();
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  async function handleUpdateThumbnail() {
    const requestBody = new FormData();

    if (thumbnailEntries?.length) {
      requestBody.append("applicationId", String(app.id));
      requestBody.append("thumbnail", thumbnailEntries[0]);

      return await formdataFetch(
        "/api/v1/applications/thumbnails",
        requestBody,
        "POST"
      );
    }
  }

  const applicationMutation = useMutation({
    mutationFn: handleUpdateThumbnail,
    onSuccess: (res) => {
      console.log("RESULT", res);
      setThumbnailEntries(null);
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
  });

  function buttonStatus() {
    if (applicationMutation.isPending) {
      return (
        <button className="bg-red-800 bg-opacity-70 py-2 px-5 rounded-md text-white font-semibold mt-2">
          Loading...
        </button>
      );
    } else if (thumbnailEntries?.length) {
      return (
        <button
          type="submit"
          className="bg-red-800 py-2 px-5 rounded-md text-white font-semibold mt-2"
        >
          Upload
        </button>
      );
    }
  }

  function imageSource() {
    if (app?.thumbnail) {
      return (
        <Image
          src={`${base_url}${app.thumbnail}`}
          alt="thumbnail"
          width={72}
          height={72}
        />
      );
    } else {
      return (
        <Image
          src={`${base_url}/assets/default.png`}
          alt="thumbnail"
          width={72}
          height={72}
        />
      );
    }
  }

  return (
    <div className="flex gap-10 items-center">
      <div>{imageSource()}</div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applicationMutation.mutate();
          }}
          className="max-w-lg mb-5"
        >
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Update Gambar Permohonan
              </label>
              <input
                onChange={(e) => setThumbnailEntries(e.target.files)}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                aria-describedby="user_avatar_help"
                id="user_avatar"
                type="file"
              />
              <div className="mt-1 text-sm text-gray-500" id="user_avatar_help">
                Upload gambar dengan format .jpg, atau .png
              </div>
            </div>
            <div>{buttonStatus()}</div>
          </div>
        </form>
      </div>
    </div>
  );
}
