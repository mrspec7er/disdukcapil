"use client";

import AlertMessage from "@/app/components/alert-message";
import Loading from "@/app/components/loading";
import mutationFetch from "@/app/utils/mutation-fetch";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    const requestBody = {
      email,
    };

    mutationFetch("/api/v1/auth/forgot-password", requestBody, "POST")
      .then(() => {
        console.log("REDIRECT TO BY USER ROLE");
      })
      .catch((err) => {
        setMessage(err.message);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
  }
  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <div className="flex flex-col items-center mt-20 w-full min-h-[80vh]">
        <div className="text-black text-center">
          <p className="text-4xl font-bold">Selamat Datang</p>
          <p className="text-xl font-medium">
            Reset Password Untuk Akun Yang Sudah Terdaftar
          </p>
        </div>
        <div className="mt-5 w-full max-w-screen-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border-2 border-gray-400 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full py-5"
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xl w-full sm:w-auto px-32 py-3.5 text-center"
              >
                Reset Password
              </button>
            </div>
            <div className="flex justify-center my- font-medium">
              <p className="text-black my-3">
                Belum punya akun?
                <Link href={"/auth/register"}>
                  <span className="ml-2 text-blue-600 hover:text-blue-900">
                    Daftar Akun
                  </span>
                </Link>
              </p>
            </div>
          </form>
        </div>
        <div></div>
      </div>
      <AlertMessage message={message} setMessage={setMessage} />
    </>
  );
}
