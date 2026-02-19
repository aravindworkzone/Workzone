import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
});

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const path = window.location.pathname;
  const isPublic = ['/login', '/register','/verifyemail'].includes(path);
  
  const result = await baseQuery(args, api, extraOptions);
  
  if(result?.error?.status === 401 && !isPublic && !result?.error?.data?.refreshToken) {
    const refreshResult = await baseQuery("/auth/refresh-token", api, extraOptions);

    if (refreshResult?.error) {
      window.location.href = "/login";
      return refreshResult;
    }

    const furtherProcess = await baseQuery(args, api, extraOptions);
    return furtherProcess;
  }

  if (result?.error?.status === 401 && !isPublic) {
    window.location.href = "/login";
  }

  return result;
};
