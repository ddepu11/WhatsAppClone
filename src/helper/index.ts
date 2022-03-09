import * as SecureStore from "expo-secure-store";

export async function saveValueInLocalStorage(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getValueFromLocalStorage(key: string) {
  let result = await SecureStore.getItemAsync(key);

  if (result) {
    return result;
  } else {
    return `No values stored under that key.`;
  }
}

export async function deleteValueFromLocalStorage(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export const whenWasTheDocUpdatedOrCreated = (time: number): string => {
  let currentTimeInMs: number;
  let lastUpdatedWhen = ``;

  currentTimeInMs = Date.now() + 900 - time;

  // 1s  = 1000ms
  // 1m  = 60 * 1000
  // 1hr = 60 * 60 * 1000
  // 1day =  24 *60 * 60 *1000

  const msInAMinute = 60 * 1000;
  const msInAHour = 60 * 60 * 1000;
  const msInADay = 24 * 60 * 60 * 1000;
  const msInAWeek = msInADay * 7;

  const week = Math.floor(currentTimeInMs / msInAWeek);
  const days = Math.floor(currentTimeInMs / msInADay);
  const hours = Math.floor((currentTimeInMs % msInADay) / msInAHour);
  const minutes = Math.floor((currentTimeInMs % msInAHour) / msInAMinute);
  const seconds = Math.floor((currentTimeInMs % msInAMinute) / 1000);

  if (seconds !== 0) {
    lastUpdatedWhen = `${seconds} sec`;
  }

  if (minutes !== 0) {
    lastUpdatedWhen = `${minutes} Mins`;
  }

  if (hours !== 0) {
    lastUpdatedWhen = `${hours} hrs`;
  }

  if (days !== 0) {
    lastUpdatedWhen = `${days} days`;
  }

  if (week !== 0) {
    lastUpdatedWhen = `${week} weeks`;
  }

  return lastUpdatedWhen;
};
