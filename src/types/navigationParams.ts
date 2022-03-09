import Routes from '../constants/routes'

type navigationParams = {
  [Routes.OTPScreen]: {
    verificationId: string
    mobileNumber: string
    countryCode: string
  }
  [Routes.SignInScreen]: undefined
  [Routes.AccountScreen]: undefined
  [Routes.CallScreen]: undefined
  [Routes.CameraScreen]: undefined
  [Routes.ChatsScreen]: undefined
  [Routes.StatusScreen]: undefined
  [Routes.BottomNavigationBar]: undefined
  [Routes.DpAndUserName]: undefined
  [Routes.ShowMessageScreen]: {
    chatId: string
    personName: string
    displayPicUrl: string
    otherPersonId: string
  }
}

export default navigationParams
