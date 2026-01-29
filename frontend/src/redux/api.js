import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: 'api',
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
        AddTask: builder.mutation({
            query: (credentials) => ({
                url: 'task/addtask',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
})

export const { useLoginUserMutation, useLogoutUserMutation, useRegisterUserMutation, useCheckUserQuery, useAddTaskMutation } = api;