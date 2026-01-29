import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const auth_api = createApi({
    reducerPath: 'api/auth',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/', credentials: 'include' }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logoutUser: builder.mutation({
            query: (credentials) => ({
                url: 'auth/logout',
                method: 'POST',
                body: credentials,
            }),
        }),
        registerUser: builder.mutation({
            query: (credentials) => ({
                url: 'auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        checkUser: builder.query({
            query: () => ({
                url: 'auth/check',
                method: 'GET',
            }),
        }),
    }),
})

export const { useLoginUserMutation, useLogoutUserMutation, useRegisterUserMutation, useCheckUserQuery } = auth_api;