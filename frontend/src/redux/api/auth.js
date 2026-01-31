import { BaseApi } from './api';

export const auth_api = BaseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        logoutUser: builder.mutation({
            query: (credentials) => ({
                url: 'auth/logout',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        registerUser: builder.mutation({
            query: (credentials) => ({
                url: 'auth/register',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        checkUser: builder.query({
            query: () => ({
                url: 'auth/check',
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),
    }),
})

export const { useLoginUserMutation, useLogoutUserMutation, useRegisterUserMutation, useCheckUserQuery } = auth_api;