import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: { sendMessageLoading: false },
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,

  reducers: {
    messageSendRequest: (state) => {
      state.value = { ...state.value, sendMessageLoading: true }
    },

    messageSendSuccess: (state) => {
      state.value = { ...state.value, sendMessageLoading: false }
    },

    messageSendFailure: (state) => {
      state.value = { ...state.value, sendMessageLoading: false }
    },
  },
})

export const { messageSendFailure, messageSendRequest, messageSendSuccess } =
  messagesSlice.actions

export default messagesSlice.reducer
