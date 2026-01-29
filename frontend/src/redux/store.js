import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth";
import taskReducer from "./slice/task";
import { auth_api } from "./api/auth";
import { task_api } from "./api/task";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        task: taskReducer,
        [auth_api.reducerPath]: auth_api.reducer,
        [task_api.reducerPath]: task_api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(auth_api.middleware,task_api.middleware),
});