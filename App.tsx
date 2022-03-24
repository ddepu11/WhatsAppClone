import { NativeBaseProvider } from 'native-base'
import { FC } from 'react'
import MainNavigation from './src/navigation/MainNavigation'
import { LogBox } from 'react-native'
import { Provider } from 'react-redux'
import reduxStore from './redux/store'

// Ignore this warning.
LogBox.ignoreLogs(['Setting a timer for a long period of time'])

const App: FC = () => {
  return (
    <NativeBaseProvider>
      <Provider store={reduxStore}>
        <MainNavigation />
      </Provider>
    </NativeBaseProvider>
  )
}

export default App
