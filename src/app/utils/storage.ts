import { TimetableStore } from "../types/timetable";

const STORAGE_KEY = 'timetable-data';

// localStorageからデータを取得
export const getTimetableData = (): TimetableStore => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load timetable data:', error);
    return [];
  }
};

// localStorageにデータを保存
export const saveTimetableData = (data: TimetableStore): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save timetable data:', error);
  }
};
