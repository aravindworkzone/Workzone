import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useLocation } from "react-router-dom";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://todo-mioj.onrender.com/api",
  credentials: "include",
});

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const path = window.location.pathname;
  const isPublic = ['/login', '/register'].includes(path);
  
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 && !isPublic) {
    window.location.href = "/login";
  }

  return result;
};
