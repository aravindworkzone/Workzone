import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const BaseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Auth', 'Task'],
    endpoints: () => ({})
});