import createSagaMiddlewere from 'redux-saga'

import { configureStore } from '@reduxjs/toolkit'
import userReducer from './states/userState'
import messagesReducer from './states/messagesState'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { rootSaga } from './sagas/rootSaga'

const saga = createSagaMiddlewere()

const store = configureStore({
  reducer: { user: userReducer, messages: messagesReducer },
  middleware: [saga],
})

saga.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
