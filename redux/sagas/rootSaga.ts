import { all, fork } from 'redux-saga/effects'
import userSaga from './userSaga/userSaga'

export function* rootSaga() {
  yield all([fork(userSaga)])
}
