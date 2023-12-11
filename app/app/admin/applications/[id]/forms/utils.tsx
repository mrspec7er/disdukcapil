"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { BsPlusSquare, BsTrash } from "react-icons/bs";
import Loading from "@/app/components/loading";
import mutationFetch from "@/app/utils/mutation-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import WarningMessage from "@/app/components/warning-message";
import { FieldType, FormType } from "@/app/utils/models";
export function ApplicationFormMutation({ form }: { form?: FormType }) {
  const [name, setName] = useState(form?.name ?? "");

  const [fields, setFields] = useState<Array<FieldType>>(form?.fields ?? []);
  const [activeDeleteButton, setActiveDeleteButton] = useState<null | number>(
    null
  );

  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();

  async function handleSubmitForm() {
    const requestBody = {
      id: form?.id,
      applicationId: Number(params?.id),
      name,
      fields,
    };

    return await mutationFetch("/api/v1/forms/", requestBody, "PUT");
  }

  const formMutation = useMutation({
    mutationFn: handleSubmitForm,
    onSuccess: (res) => {
      console.log("RESULT", res);

      if (res.data?.id) {
        router.push(`/admin/applications/${params?.id}?section=form`);
        queryClient.invalidateQueries({ queryKey: ["form"] });
      }
    },
  });

  async function handleAddField() {
    setFields((current) => {
      return [
        ...current,
        {
          name: "",
          type: "TEXT",
          isRequired: true,
          options: [],
          order: (current[current.length - 1]?.order ?? 0) + 1,
        },
      ];
    });
  }

  if (formMutation.isPending) {
    return <Loading />;
  }
  return (
    <div onClick={() => setActiveDeleteButton(null)}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-6">
          <label className="block mb-2 font-medium text-sm text-gray-500">
            Nama Form
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border-2 border-gray-300 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
      </form>
      {fields.map((field) => (
        <CurrentFields
          key={field.order}
          field={field}
          setFields={setFields}
          activeDeleteButton={activeDeleteButton}
          setActiveDeleteButton={setActiveDeleteButton}
        />
      ))}
      <div className="w-full flex justify-end px-12 md:mt-7">
        <button
          type="button"
          onClick={() => handleAddField()}
          className="text-5xl text-red-800"
        >
          <BsPlusSquare />
        </button>
      </div>

      <div className="mb-2 mt-12 w-3/12 mx-auto">
        <button
          onClick={() => formMutation.mutate()}
          type="button"
          className="w-full border-gray-300 bg-red-800 py-2 rounded-md text-white font-bold text-xl"
        >
          Submit
        </button>
      </div>
      {formMutation.data?.message ? (
        <WarningMessage message={formMutation.data?.message} />
      ) : null}
    </div>
  );
}

function CurrentFields({
  field,
  setFields,
  activeDeleteButton,
  setActiveDeleteButton,
}: {
  field: FieldType;
  setFields: Dispatch<SetStateAction<FieldType[]>>;
  activeDeleteButton: number | null;
  setActiveDeleteButton: Dispatch<SetStateAction<number | null>>;
}) {
  async function handleUpdateFieldName(fieldName: string) {
    setFields((current) => {
      return current.map((val) => {
        if (val.order !== field.order) {
          return val;
        } else {
          return {
            ...val,
            name: fieldName,
          };
        }
      });
    });
  }

  async function handleUpdateFieldType(fieldType: string) {
    setFields((current) => {
      return current.map((val) => {
        if (val.order !== field.order) {
          return val;
        } else {
          return {
            ...val,
            type: fieldType,
          };
        }
      });
    });
  }

  async function handleUpdateFieldRequiredStatus(fieldRequiredStatus: boolean) {
    console.log("STATUS", fieldRequiredStatus);

    setFields((current) => {
      return current.map((val) => {
        if (val.order !== field.order) {
          return val;
        } else {
          return {
            ...val,
            isRequired: fieldRequiredStatus,
          };
        }
      });
    });
  }

  async function handleDeleteField() {
    setFields((current) => current.filter((val) => val.order !== field.order));
    if (field.id) {
      await mutationFetch("/api/v1/forms/fields/" + field.id, {}, "DELETE");
    }
  }

  return (
    <div className={"mb-5 text-sm text-gray-700"}>
      <div className="mb-2 flex md:flex-row flex-col justify-between items-center md:gap-5 gap-2">
        <div className="w-full">
          <label className="block mb-2 font-medium text-sm text-gray-500">
            Nama Kolom
          </label>
          <input
            type="text"
            value={field.name}
            onChange={(e) => handleUpdateFieldName(e.target.value)}
            className="bg-gray-50 border-2 border-gray-300 rounded-lg block w-full p-2.5"
          />
        </div>
        <div className="w-full md:w-1/2">
          <label className="block mb-2 font-medium text-sm text-gray-500">
            Jenis
          </label>
          <select
            id="countries"
            value={field.type}
            onChange={(e) => handleUpdateFieldType(e.target.value)}
            className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value={"TEXT"}>Teks</option>
            <option value={"NUMBER"}>Angka</option>
            <option value={"DATE"}>Tanggal</option>
            <option value={"TIME"}>Waktu</option>
            <option value={"SELECT"}>Pilihan Ganda</option>
          </select>
        </div>
        <div className="flex md:w-1/6 w-full items-center ml-1 mt-3.5">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              onChange={(e) =>
                handleUpdateFieldRequiredStatus(e.target.checked)
              }
              defaultChecked={field.isRequired}
              className="w-4 h-4 border-2 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
            />
          </div>
          <label className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">
            Wajib
          </label>
        </div>
        <div className="md:w-1/6 w-full flex md:justify-center justify-end mt-3.5">
          {activeDeleteButton === field.order ? (
            <button
              onClick={() => handleDeleteField()}
              type="button"
              className="font-semibold text-red-500 ms-3 border-4 py-2 px-3.5 rounded-md border-red-400 hover:bg-red-100"
            >
              HAPUS
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDeleteButton(field.order);
              }}
              type="button"
              className="text-2xl text-red-800 hover:scale-125 ml-3"
            >
              <BsTrash />
            </button>
          )}
        </div>
      </div>
      {field.type === "SELECT" ? (
        <OptionsInput field={field} setFields={setFields} />
      ) : null}
    </div>
  );
}

function OptionsInput({
  field,
  setFields,
}: {
  field: FieldType;
  setFields: Dispatch<SetStateAction<FieldType[]>>;
}) {
  const [optionsEntry, setOptionsEntry] = useState("");

  async function handleAddOption(event: any) {
    if (event.key === "Enter") {
      setFields((current) => {
        return current.map((val) => {
          if (val.order !== field.order) {
            return val;
          } else {
            return {
              ...val,
              options: [...val.options, event.target.value],
            };
          }
        });
      });
      setOptionsEntry("");
    }
  }

  async function handleRemoveOption(option: string) {
    setFields((current) => {
      return current.map((val) => {
        if (val.order !== field.order) {
          return val;
        } else {
          return {
            ...val,
            options: val.options.filter((opt) => opt !== option),
          };
        }
      });
    });
  }
  return (
    <>
      <div className="mb-5">
        <div className="mb-2 flex items-center gap-3">
          <h2 className=" font-medium text-sm">Opsi:</h2>
          <ul className="max-w-sm text-gray-600 list-disc list-inside text-sm flex gap-5 flex-wrap items-center">
            {field?.options.map((opt, i) => (
              <li
                onClick={() => handleRemoveOption(opt)}
                className="hover:text-red-800 hover:cursor-pointer flex items-center gap-1"
                key={i}
              >
                <p>{opt}</p>
                <p className="hover:scale-125 text-base text-red-800 hover:text-yellow-400">
                  <BsTrash />
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-5 items-center">
          <input
            onKeyDown={(e) => handleAddOption(e)}
            type="text"
            id="outcomes"
            value={optionsEntry}
            className="bg-gray-50 border border-gray-300 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-1/3 p-1.5"
            onChange={(e) => {
              setOptionsEntry(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
}
