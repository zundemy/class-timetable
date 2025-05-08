import { useState, useEffect } from 'react';
import { Timetable, TimeSlot, TimetableStore } from '../types/timetable';
import { getTimetableData, saveTimetableData } from '../utils/storage';

export const useTimetable = () => {
  const [timetables, setTimetables] = useState<TimetableStore>([]);
  const [currentYear, setCurrentYear] = useState<number>(1);
  const [currentSemester, setCurrentSemester] = useState<'前期' | '後期'>('前期');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 初期データの読み込み
  useEffect(() => {
    const loadData = () => {
      const data = getTimetableData();
      setTimetables(data);
      
      // 初期表示用の学年・学期を設定
      if (data.length > 0) {
        setCurrentYear(data[0].year);
        setCurrentSemester(data[0].semester);
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // 現在の時間割を取得
  const getCurrentTimetable = (): Timetable | undefined => {
    return timetables.find(
      (t) => t.year === currentYear && t.semester === currentSemester
    );
  };

  // 時間割を取得（なければ作成）
  const getOrCreateTimetable = (): Timetable => {
    const existing = getCurrentTimetable();
    if (existing) {
      return existing;
    }

    // 新しい時間割を作成
    const newTimetable: Timetable = {
      year: currentYear,
      semester: currentSemester,
      slots: [],
    };

    // 配列に追加して保存
    const updatedTimetables = [...timetables, newTimetable];
    setTimetables(updatedTimetables);
    saveTimetableData(updatedTimetables);

    return newTimetable;
  };

  // 授業を追加または更新
  const saveTimeSlot = (slot: TimeSlot): void => {
    const timetable = getOrCreateTimetable();
    
    // 既存のスロットを探す（同じ曜日・時限）
    const existingIndex = timetable.slots.findIndex(
      (s) => s.day === slot.day && s.period === slot.period
    );

    let updatedTimetable: Timetable;
    
    if (existingIndex >= 0) {
      // 既存のスロットを更新
      const updatedSlots = [...timetable.slots];
      updatedSlots[existingIndex] = slot;
      
      updatedTimetable = {
        ...timetable,
        slots: updatedSlots,
      };
    } else {
      // 新しいスロットを追加
      updatedTimetable = {
        ...timetable,
        slots: [...timetable.slots, slot],
      };
    }

    // 時間割配列を更新
    const updatedTimetables = timetables.map((t) =>
      t.year === currentYear && t.semester === currentSemester
        ? updatedTimetable
        : t
    );

    // 該当する時間割がなければ追加
    if (!updatedTimetables.some(t => t.year === currentYear && t.semester === currentSemester)) {
      updatedTimetables.push(updatedTimetable);
    }

    setTimetables(updatedTimetables);
    saveTimetableData(updatedTimetables);
  };

  // 授業を削除
  const deleteTimeSlot = (day: TimeSlot['day'], period: number): void => {
    const timetable = getCurrentTimetable();
    if (!timetable) return;

    // 該当するスロットを除外
    const updatedSlots = timetable.slots.filter(
      (s) => !(s.day === day && s.period === period)
    );

    const updatedTimetable = {
      ...timetable,
      slots: updatedSlots,
    };

    // 時間割配列を更新
    const updatedTimetables = timetables.map((t) =>
      t.year === currentYear && t.semester === currentSemester
        ? updatedTimetable
        : t
    );

    setTimetables(updatedTimetables);
    saveTimetableData(updatedTimetables);
  };

  // 特定の曜日・時限の授業を取得
  const getTimeSlot = (day: TimeSlot['day'], period: number): TimeSlot | undefined => {
    const timetable = getCurrentTimetable();
    if (!timetable) return undefined;

    return timetable.slots.find(
      (s) => s.day === day && s.period === period
    );
  };

  // 利用可能な学年のリストを取得
  const getAvailableYears = (): number[] => {
    const years = timetables.map(t => t.year);
    return [...new Set(years)].sort((a, b) => a - b);
  };

  // 新しい学年を追加
  const addNewYear = (year: number): void => {
    // 既に存在する学年かチェック
    const existingYears = getAvailableYears();
    if (existingYears.includes(year)) {
      return; // 既に存在する場合は何もしない
    }

    // 前期と後期の空の時間割を作成
    const newTimetableFront: Timetable = {
      year,
      semester: '前期',
      slots: [],
    };

    const newTimetableBack: Timetable = {
      year,
      semester: '後期',
      slots: [],
    };

    // 配列に追加して保存
    const updatedTimetables = [...timetables, newTimetableFront, newTimetableBack];
    setTimetables(updatedTimetables);
    saveTimetableData(updatedTimetables);

    // 新しい学年に切り替える
    setCurrentYear(year);
    setCurrentSemester('前期');
  };

  return {
    timetables,
    currentYear,
    setCurrentYear,
    currentSemester,
    setCurrentSemester,
    isLoading,
    getCurrentTimetable,
    saveTimeSlot,
    deleteTimeSlot,
    getTimeSlot,
    getAvailableYears,
    addNewYear,
  };
};
