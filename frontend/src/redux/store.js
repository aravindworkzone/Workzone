import { configureStore } from "@reduxjs/toolkit";
import { mode } from "./slice/mode";
import { deviceType } from "./slice/deviceType";
import { BaseApi } from "./api/api";

export const store = configureStore({
    reducer: {
        mode: mode.reducer,
        deviceType: deviceType.reducer,
        [BaseApi.reducerPath]: BaseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(BaseApi.middleware),
});