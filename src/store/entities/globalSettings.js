import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
  name: "globalSettings",
  initialState: {
    windowSize: {},
    isNavOpen: true,
  },
  reducers: {
    updateWindowSize: (settings, action) => {
      const { height, width } = action.payload
      settings.windowSize = { height: height, width: width }
      console.log("new state:", JSON.stringify(settings))
    },

    updateNavState: (settings, _action) => {
      settings.isNavOpen = !settings.isNavOpen
    },
  },
})

export default slice.reducer

export const { updateWindowSize, updateNavState } = slice.actions