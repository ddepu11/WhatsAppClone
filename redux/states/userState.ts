import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  FetchUserInfoRequest,
  FetchUserInfoSuccess,
  LogInRequestSuccess,
  SaveUserInfoRequest,
  userState
} from '../types/types'

const initialState: userState = {
  value: {
    isLoading: false,
    loggedIn: false,
    mobileNumber: '',
    displayPic: { fileName: '', url: '' },
    firstName: '',
    lastName: '',
    userName: '',
    id: ''
  }
}

const userSlice = createSlice({
  name: 'user',

  initialState,

  reducers: {
    userLoadingStarts: state => {
      state.value = { ...state.value, isLoading: true }
    },

    userLoadingEnds: state => {
      state.value = { ...state.value, isLoading: false }
    },

    logInSuccess: (state, action: PayloadAction<LogInRequestSuccess>) => {
      state.value = {
        ...state.value,
        isLoading: false,
        loggedIn: true,
        mobileNumber: action.payload.mobileNumber
      }
    },

    logInFailed: state => {
      state.value = { ...state.value, isLoading: false }
    },

    saveUserInfoRequest: (
      state,
      action: PayloadAction<SaveUserInfoRequest>
    ) => {
      state.value = { ...state.value, isLoading: true }
    },

    saveUserInfoSuccess: state => {
      state.value = { ...state.value, isLoading: false }
    },

    saveUserInfoFailure: state => {
      state.value = { ...state.value, isLoading: false }
    },

    fetchUserInfoRequest: (
      state,
      action: PayloadAction<FetchUserInfoRequest>
    ) => {
      state.value = { ...state.value, isLoading: true }
    },

    fetchUserInfoSuccess: (
      state,
      action: PayloadAction<FetchUserInfoSuccess>
    ) => {
      state.value = { ...state.value, isLoading: false, ...action.payload }
    },

    fetchUserInfoFailure: state => {
      state.value = { ...state.value, isLoading: false }
    },

    updateUserInfoRequest: (
      state,
      action: PayloadAction<{
        id: string
        displayPic?: Blob
        oldDisplayPicName?: string
        firstName: string
        lastName: string
        userName: string
        mobileNumber: string
      }>
    ) => {
      state.value = { ...state.value, isLoading: true }
    }
  }
})

export const {
  saveUserInfoRequest,
  saveUserInfoSuccess,
  saveUserInfoFailure,
  userLoadingStarts,
  userLoadingEnds,
  logInSuccess,
  logInFailed,
  fetchUserInfoRequest,
  fetchUserInfoSuccess,
  fetchUserInfoFailure,
  updateUserInfoRequest
} = userSlice.actions

export default userSlice.reducer
