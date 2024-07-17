import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 元のオブジェクトに変更与えないようにするため、
// JSON.stringify => オブジェクトをJSON形式の文字列に変換
// JSON.parse => JSON形式の文字列をオブジェクトに変換
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

// Fileオブジェクトを受け取り、そのオブジェクトのURLを生成
// ファイルプレビュー用
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// 日付と時間をフォーマットするための関数
export const formatDateTime = (dateString: Date | string) => {
  // 日付と時間のフォーマットオプション
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // 月名を短縮形で表示 (例: 'Oct')
    day: "numeric", // 日を数字で表示 (例: '25')
    year: "numeric", // 年を数字で表示 (例: '2023')
    hour: "numeric", // 時間を数字で表示 (例: '8')
    minute: "numeric", // 分を数字で表示 (例: '30')
    hour12: true, // 12時間制を使用 (true) または 24時間制 (false)
  };

  // 曜日と日付のフォーマットオプション
  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // 曜日名を短縮形で表示 (例: 'Mon')
    year: "numeric", // 年を数字で表示 (例: '2023')
    month: "2-digit", // 月を2桁の数字で表示 (例: '10')
    day: "2-digit", // 日を2桁の数字で表示 (例: '25')
  };

  // 日付のみのフォーマットオプション
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // 月名を短縮形で表示 (例: 'Oct')
    year: "numeric", // 年を数字で表示 (例: '2023')
    day: "numeric", // 日を数字で表示 (例: '25')
  };

  // 時間のみのフォーマットオプション
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // 時間を数字で表示 (例: '8')
    minute: "numeric", // 分を数字で表示 (例: '30')
    hour12: true, // 12時間制を使用 (true) または 24時間制 (false)
  };

  // 日付と時間のフォーマットされた文字列
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  // 曜日と日付のフォーマットされた文字列
  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  // 日付のみのフォーマットされた文字列
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  // 時間のみのフォーマットされた文字列
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  // フォーマットされた文字列を含むオブジェクトを返す
  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
