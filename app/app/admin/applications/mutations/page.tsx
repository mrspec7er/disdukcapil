import { ApplicationMutationForm } from "./utils";

export default function ApplicationMutationInsert() {
  return (
    <div className="border-2 border-red-800 rounded-lg ">
      <div className="bg-red-800 font-semibold p-5 text-xl rounded-t-md rounded-b-sm">
        Tambah Permohonan
      </div>
      <div className="p-5 text-black">
        <ApplicationMutationForm key={"0"} />
      </div>
    </div>
  );
}
