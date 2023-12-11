"use client";

import AlertMessage from "@/app/components/alert-message";
import Loading from "@/app/components/loading";
import mutationFetch from "@/app/utils/mutation-fetch";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [nik, setNik] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    if (password !== confirmPassword) {
      setMessage("Password and confirm password doesn't match");
      setIsLoading(false);
      return;
    }
    const requestBody = {
      email,
      phone,
      name,
      nik,
      placeOfBirth,
      dateOfBirth,
      password,
    };

    console.log(requestBody);

    mutationFetch("/api/v1/auth/register", requestBody, "POST")
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
          <p className="text-xl font-medium">Daftar Akun Bagi Pengguna Baru</p>
        </div>
        <div className="mt-5 w-full max-w-screen-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex flex-col md:flex-row gap-x-5">
              <div className="mb-6 w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-400 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full py-5"
                  placeholder="name@email.com"
                  required
                />
              </div>
              <div className="mb-6 w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Telepon
                </label>
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-400 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full py-5"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-x-5">
              <div className="mb-6 w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-400 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full py-5"
                  placeholder="Nama Lengkap"
                  required
                />
              </div>
              <div className="mb-6 w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  NIK
                </label>
                <input
                  type="number"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-400 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full py-5"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-x-5">
              <div className="mb-6 w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  value={placeOfBirth}
                  onChange={(e) => setPlaceOfBirth(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-400 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full py-5"
                  placeholder="Tempat Lahir"
                  required
                />
              </div>
              <div className="mb-6 w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-400 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full py-5"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-x-5">
              <div className="mb-6 w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="bg-gray-50 border-2 border-gray-400 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full py-5"
                  required
                />
              </div>
              <div className="mb-6 w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-400 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full py-5"
                  required
                />
              </div>
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
                Sudah punya akun?
                <Link href={"/auth/login"}>
                  <span className="ml-2 text-blue-600 hover:text-blue-900">
                    Login
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
