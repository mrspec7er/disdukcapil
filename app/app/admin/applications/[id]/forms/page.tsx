import { ApplicationFormMutation } from "./utils";

export default function ApplicationFormInsert() {
  return (
    <div className="border-2 border-red-800 rounded-lg ">
      <div className="bg-red-800 font-semibold p-5 text-xl rounded-t-md rounded-b-sm">
        Tambah Form
      </div>
      <div className="p-5 text-black">
        <ApplicationFormMutation />
      </div>
    </div>
  );
}
