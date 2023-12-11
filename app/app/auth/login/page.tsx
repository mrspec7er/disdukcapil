"use client";

import Loading from "@/app/components/loading";
import WarningMessage from "@/app/components/warning-message";
import mutationFetch from "@/app/utils/mutation-fetch";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleLogin() {
    const requestBody = {
      email,
      password,
    };

    return await mutationFetch("/api/v1/auth/login", requestBody, "POST");
  }

  const loginMutation = useMutation({
    mutationFn: handleLogin,
    onSuccess: (res) => {
      localStorage.setItem("user.name", res.data?.name);
      localStorage.setItem("user.email", res.data?.email);
      if (res.data?.role === "ADMIN") {
        router.push("/admin/applications");
      }
      if (res.data?.role === "USER") {
        router.push("/submission/user?status=");
      }
    },
  });

  if (loginMutation.isPending) {
    return <Loading />;
  }
  return (
    <>
      <div className="flex flex-col items-center mt-20 w-full min-h-[80vh]">
        <div className="text-black text-center">
          <p className="text-4xl font-bold">Selamat Datang</p>
          <p className="text-xl font-medium">Masuk Ke Akun Anda</p>
        </div>
        <div className="mt-5 w-full max-w-screen-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginMutation.mutate();
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
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="bg-gray-50 border-2 border-gray-400 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full py-5"
                required
              />
            </div>
            <div className="flex justify-end mb-3 font-medium">
              <Link href={"/auth/forgot-password"}>
                <span className="text-blue-600 hover:text-blue-900">
                  Lupa Password?
                </span>
              </Link>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xl w-full sm:w-auto px-32 py-3.5 text-center"
              >
                Login
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
      {loginMutation?.data?.message ? (
        <WarningMessage message={loginMutation?.data?.message} />
      ) : null}
    </>
  );
}
