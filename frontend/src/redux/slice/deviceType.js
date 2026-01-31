import { createSlice } from "@reduxjs/toolkit";

export const deviceType = createSlice({
    name: "deviceType",
    initialState: {
        deviceType: "Desktop",
    },
    reducers: {
        setDeviceType: (state, action) => {
            state.deviceType = action.payload;
        },
    },
});

export const { setDeviceType } = deviceType.actions;
export default deviceType.reducer;