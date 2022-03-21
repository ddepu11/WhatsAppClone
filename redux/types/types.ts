export interface userState {
  value: {
    isLoading: boolean
    loggedIn: boolean
    mobileNumber: string
    displayPic: { url: string; fileName: string }
    firstName: string
    lastName: string
    userName: string
    id: string
    isOnline: boolean
  }
}

interface LogInUserRequest {
  mobileNo: string
}

export interface LogInRequestSuccess {
  mobileNumber: string
}

interface LogInRequestFailure {}

export interface LogInRequestSuccess {
  mobileNumber: string
}

export interface SaveUserInfoRequest {
  firstName: string
  lastName: string
  displayPic: string
  mobileNumber: string
}

export interface FetchUserInfoRequest {
  mobileNumber: string
}

export interface FetchUserInfoSuccess {
  displayPic: {
    url: string
    fileName: string
  }
  firstName: string
  lastName: string
  userName: string
  id: string
}
