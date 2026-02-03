import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BaseApi = createApi({
    reducerPath: 'api/auth',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://172.16.55.161:5000/api/', credentials: 'include' }),
    tagTypes: ['Auth', 'Task'],
    endpoints: () => ({})
});