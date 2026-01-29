import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth";
import taskReducer from "./slice/task";
import { api } from "./api";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        task: taskReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});