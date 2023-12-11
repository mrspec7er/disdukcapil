const base_url = process.env.NEXT_PUBLIC_BASE_URL;
import mutationFetch from "./mutation-fetch";

const formdataFetch = async (
  url: string,
  body: FormData,
  method: "POST" | "PUT"
) => {
  const tokenExpiredCode = 403;

  return await fetch(base_url + url, {
    method: method,
    body,
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
      //   if (!res.ok) {
      //     console.log("Token Expired");
      //     return (window.location.href = "/login");
      //   }
      //   localStorage.setItem("accessToken", res.data.accessToken);
      //   formdataFetch(url, body, method);
      // });
    }

    return res.json();
  });
};

export default formdataFetch;
