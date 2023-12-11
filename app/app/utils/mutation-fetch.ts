const base_url = process.env.NEXT_PUBLIC_BASE_URL;

const mutationFetch = async (
  url: string,
  body: Object,
  method: "POST" | "PUT" | "DELETE"
) => {
  const tokenExpiredCode = 403;
  console.log("BASE_URL: ", base_url);

  return await fetch(base_url + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body }),
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
      //   if (!res?.data?.access_token) {
      //     console.log("Token Expired");
      //     return (window.location.href = "/login");
      //   }
      //   localStorage.setItem("accessToken", res.data.accessToken);
      //   mutationFetch(url, body, method);
      // });
    }
    return res.json();
  });
};

export default mutationFetch;
