import { ApplicationServiceMutation } from "./utils";

export default function ApplicationServiceInsert() {
  return (
    <div className="border-2 border-red-800 rounded-lg ">
      <div className="bg-red-800 font-semibold p-5 text-xl rounded-t-md rounded-b-sm">
        Tambah Pelayanan
      </div>
      <div className="p-5 text-black">
        <ApplicationServiceMutation />
      </div>
    </div>
  );
}
