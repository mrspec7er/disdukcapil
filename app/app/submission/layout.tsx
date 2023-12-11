"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BsPerson } from "react-icons/bs";
export default function UserHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const name = localStorage.getItem("user.name");
    const email = localStorage.getItem("user.email");

    if (name && email) {
      setUserCredentials({ name, email });
    }
  }, []);
  return (
    <>
      <div
        onClick={() => setOpenModal(false)}
        className="bg-main md:min-h-[90vh] min-h-[95vh] bg-white px-3 md:px-10 py-2"
      >
        <div className="flex justify-end relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenModal(true);
            }}
            className="flex text-3xl bg-red-800 p-2 mb-2 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
            type="button"
          >
            <span className="sr-only">Open user menu</span>
            <BsPerson />
          </button>
          <div
            className={`${
              openModal ? "absolute" : "hidden"
            } z-10 top-10 right-5 border-2 border-red-800 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
          >
            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div>{userCredentials.name}</div>
              <div className="font-medium truncate">
                {userCredentials.email}
              </div>
            </div>
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownUserAvatarButton"
            >
              <li>
                <Link
                  href="/submission/user?status="
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Beranda
                </Link>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Settings
                </a>
              </li> */}
              {/* <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Earnings
                </a>
              </li> */}
            </ul>
            <div className="py-2">
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto">{children}</div>
      </div>
    </>
  );
}
