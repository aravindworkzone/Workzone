import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
});

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const path = window.location.pathname;
  const isPublic = ["/login", "/register", "/verifyemail"].includes(path);
  const isRefreshAttempt =
    args?.url === "/auth/refresh-token" || args === "/auth/refresh-token";

  const result = await baseQuery(args, api, extraOptions);
  console.log(result?.error?.status);
  console.log(isRefreshAttempt);
  console.log(isPublic);
  if (result?.error?.status === 401 && !isRefreshAttempt) {
    const refreshResult = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOptions
    );

    if (refreshResult?.error) {
      window.location.href = "/login";
      return refreshResult;
    }

    return await baseQuery(args, api, extraOptions);
  }

  if (result?.error?.status === 401 && !isPublic) {
    window.location.href = "/login";
  }

  return result;
};
