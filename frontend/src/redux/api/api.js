import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BaseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api', credentials: 'include' }),
    tagTypes: ['Auth', 'Task'],
    endpoints: () => ({})
});