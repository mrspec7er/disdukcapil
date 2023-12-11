import { BsPerson } from "react-icons/bs";
export default function AdminHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <div className="flex h-14 justify-center px-3 py-1.5 md:px-10 text-center">
        <div className="bg-red-800 rounded-full p-2 text-3xl">
          <BsPerson />
        </div>
      </div> */}
      <div className="bg-main md:min-h-[80vh] min-h-[85vh] bg-white px-3 md:px-10 py-5">
        <div className="max-w-screen-2xl mx-auto">{children}</div>
      </div>
    </>
  );
}
