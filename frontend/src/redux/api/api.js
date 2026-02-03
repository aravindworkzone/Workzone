import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BaseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://todo-mioj.onrender.com/api/', credentials: 'include' }),
    tagTypes: ['Auth', 'Task'],
    endpoints: () => ({})
});