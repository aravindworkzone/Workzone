import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const task_api = createApi({
    reducerPath: 'api/task',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/', credentials: 'include' }),
    endpoints: (builder) => ({
        AddTask: builder.mutation({
            query: (credentials) => ({
                url: 'task/addtask',
                method: 'POST',
                body: credentials,
            }),
        }),
        GetTask: builder.query({
            query: () => ({
                url: 'task/gettask',
                method: 'GET',
            }),
        }),
        UpdateTask: builder.mutation({
            query: (credentials) => ({
                url: 'task/updatetask',
                method: 'POST',
                body: credentials,
            }),
        }),
        DeleteTask: builder.mutation({
            query: (credentials) => ({
                url: 'task/deletetask',
                method: 'POST',
                body: credentials,
            }),
        }),
        EditTask: builder.mutation({
            query: (credentials) => ({
                url: 'task/edittask',
                method: 'POST',
                body: credentials,
            }),
        })
    }),
})

export const { useAddTaskMutation, useGetTaskQuery, useUpdateTaskMutation, useDeleteTaskMutation, useEditTaskMutation } = task_api;