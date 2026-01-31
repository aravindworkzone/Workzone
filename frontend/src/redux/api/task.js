import { BaseApi } from './api';

export const task_api = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        AddTask: builder.mutation({
            query: (credentials) => ({
                url: 'task/addtask',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ["Task"],
        }),
        GetTask: builder.query({
            query: (mode) => ({
                url: `task/gettask?type=${mode}`,
                method: 'GET',
            }),
            providesTags: ["Task"],
        }),
        GetTaskHistory: builder.query({
            query: () => ({
                url: `task/gettaskhistory`,
                method: 'GET',
            }),
            providesTags: ["Task"],
        }),
        UpdateTask: builder.mutation({
            query: (credentials) => ({
                url: 'task/updatetask',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ["Task"],
        }),
        DeleteTask: builder.mutation({
            query: (credentials) => ({
                url: 'task/deletetask',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ["Task"],
        }),
        EditTask: builder.mutation({
            query: (credentials) => ({
                url: 'task/edittask',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ["Task"],
        }),
        Productivity: builder.query({
            query: () => ({
                url: 'task/productivity',
                method: 'GET',
            }),
            providesTags: ["Task"],
        }),
    }),
})

export const { useAddTaskMutation, useGetTaskQuery, useUpdateTaskMutation, useDeleteTaskMutation, useEditTaskMutation, useGetTaskHistoryQuery, useProductivityQuery } = task_api;