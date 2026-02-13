import { createSlice } from "@reduxjs/toolkit";

export const mode = createSlice({
    name: "mode",
    initialState: {
        mode: "Today Task",
    },
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload;
        },
    },
});

export const { setMode } = mode.actions;
export default mode.reducer;