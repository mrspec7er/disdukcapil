const base_url = process.env.NEXT_PUBLIC_BASE_URL;
import mutationFetch from "./mutation-fetch";

const queryFetch = async (url: string) => {
  const tokenExpiredCode = 403;

  return await fetch(base_url + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((res) => {
    if (res.status === tokenExpiredCode) {
      return (window.location.href = "/auth/login");
      // const refresh_token = localStorage.getItem("refreshToken");
      // mutationFetch(
      //   "/api/v1/users/token",
      //   { refreshToken: refresh_token },
      //   "POST"
      // ).then((res) => {
      //   if (!res?.data?.accessToken) {
      //     console.log("Token Expired");
      //     return (window.location.href = "/login");
      //   }
      //   localStorage.setItem("accessToken", res.data.accessToken);
      //   queryFetch(url);
      // });
    }

    return res.json();
  });
};

export default queryFetch;
