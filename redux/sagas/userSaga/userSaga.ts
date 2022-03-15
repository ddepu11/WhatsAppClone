import { takeEvery, call, put } from "redux-saga/effects";
import {
  fetchUserInfoFailure,
  fetchUserInfoRequest,
  fetchUserInfoSuccess,
  saveUserInfoFailure,
  saveUserInfoRequest,
  updateUserInfoRequest,
  userLoadingEnds,
} from "../../states/userState";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { firebaseStorage, firestoreDB } from "../../../firebaseconfig";
import firestore from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { FetchUserInfoSuccess, userState } from "../../types/types";

function* fetchUserInfo(action: any) {
  const { mobileNumber } = action.payload;

  try {
    const usersRef = collection(firestoreDB, "users");

    const q = query(usersRef, where("mobileNumber", "==", mobileNumber));

    const querySnapshot: firestore.QuerySnapshot = yield call(getDocs, q);

    if (querySnapshot.empty) {
      // New User
      console.log("New User");

      yield put(
        fetchUserInfoSuccess({
          displayPic: { url: "", fileName: "" },
          firstName: "",
          lastName: "",
          userName: "",
          id: "",
        })
      );
    } else {
      // Existing User
      console.log("Existing User");

      yield put(
        fetchUserInfoSuccess({
          ...(querySnapshot.docs[0].data() as FetchUserInfoSuccess),
          id: querySnapshot.docs[0].id,
        })
      );
    }
  } catch (err: any) {
    console.log(err.code);
    console.log(err.message);
    yield put(fetchUserInfoFailure);
  }
}

const createBlob = async (uri: string) =>
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

function* saveUserInfo(action: any) {
  // Upload Dp in storage
  const { displayPic, mobileNumber, firstName, lastName, userName } =
    action.payload;

  try {
    const blob: Blob = yield call(createBlob, displayPic);

    const imageName = `DP_${mobileNumber}.${blob.type.slice(6)}`;

    const storageRef = ref(firebaseStorage, `user_display_pics/${imageName}`);

    yield call(uploadBytes, storageRef, blob);

    const fileUrl: string = yield call(getDownloadURL, storageRef);

    const newlyCreatedDoc: firestore.DocumentReference = yield call(
      addDoc,
      collection(firestoreDB, "users"),
      {
        mobileNumber,
        firstName,
        lastName,
        userName,
        displayPic: { url: fileUrl, fileName: imageName },
        status: "",
        isOnline: true,
      }
    );

    const docSnap: firestore.DocumentSnapshot = yield call(
      getDoc,
      newlyCreatedDoc
    );

    yield put(
      fetchUserInfoSuccess({
        ...(docSnap.data() as FetchUserInfoSuccess),
        id: docSnap.id,
      })
    );
  } catch (err: any) {
    console.warn(err.code);
    console.warn(err.message);
    yield put(saveUserInfoFailure());
  }
}

function* updateUserInfo(action: any) {
  // Upload Dp in storage
  const {
    displayPic,
    id,
    firstName,
    lastName,
    userName,
    mobileNumber,
    oldDisplayPicName,
  } = action.payload;

  try {
    const userRef = doc(firestoreDB, "users", id);

    // Runs when updating Display Pic
    if (displayPic && oldDisplayPicName) {
      // 1. Deleting old DP
      const oldDPRef = ref(
        firebaseStorage,
        `user_display_pics/${oldDisplayPicName}`
      );

      yield call(deleteObject, oldDPRef);

      // 2. Uploading New DP
      const imageName = `DP_${mobileNumber}.${displayPic.type.slice(6)}`;

      const storageRef = ref(firebaseStorage, `user_display_pics/${imageName}`);

      yield call(uploadBytes, storageRef, displayPic);

      const fileUrl: string = yield call(getDownloadURL, storageRef);

      // 4. Now Updating user doc with new DP name and URL and otherthings
      const newData = {
        displayPic: { url: fileUrl, fileName: imageName },
        firstName,
        lastName,
        userName,
      };

      yield call(updateDoc, userRef, newData);
    } else {
      // Runs when not updating Display Pic
      yield call(updateDoc, userRef, { firstName, lastName, userName });
    }

    yield put(fetchUserInfoRequest({ mobileNumber }));
  } catch (err: any) {
    console.log(err.code);
    console.log(err.message);

    yield put(userLoadingEnds());
  }
}

// Generator function
function* userSaga() {
  yield takeEvery(fetchUserInfoRequest.type, fetchUserInfo);
  yield takeEvery(saveUserInfoRequest.type, saveUserInfo);

  yield takeEvery(updateUserInfoRequest.type, updateUserInfo);
}

export default userSaga;
