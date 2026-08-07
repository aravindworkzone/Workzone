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
        revokeSessions: builder.mutation({
            query: (body) => ({
                url: 'auth/sessions/revoke',
                method: 'POST',
                body,
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
        verifyEmail: builder.query({
            query: (token) => ({
                url: `auth/verifyemail?token=${token}`,
                method: 'GET',
            }),
            providesTags: ['Auth'],
        })
    }),
})

export const { useLoginUserMutation, useLogoutUserMutation, useRevokeSessionsMutation, useRegisterUserMutation, useCheckUserQuery, useVerifyEmailQuery } = auth_api;