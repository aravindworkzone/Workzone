import { BaseApi } from './api';

export const goal_api = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        Addgoal: builder.mutation({
            query: (credentials) => ({
                url: 'goal/addgoal',
                method: 'POST',
                body: credentials,
            }),
        }),
        Getgoal: builder.query({
            query: () => ({
                url: 'goal/getgoal',
                method: 'GET',
            }),
        }),
        Updategoal: builder.mutation({
            query: (credentials) => ({
                url: 'goal/updategoal',
                method: 'POST',
                body: credentials,
            }),
        }),
        Deletegoal: builder.mutation({
            query: (credentials) => ({
                url: 'goal/deletegoal',
                method: 'POST',
                body: credentials,
            }),
        }),
        Editgoal: builder.mutation({
            query: (credentials) => ({
                url: 'goal/editgoal',
                method: 'POST',
                body: credentials,
            }),
        })
    }),
})

export const { useAddgoalMutation, useGetgoalQuery, useUpdategoalMutation, useDeletegoalMutation, useEditgoalMutation } = goal_api;