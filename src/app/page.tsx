'use client';

import { useState, useEffect } from 'react';
import { SemesterSelector } from './components/semester-selector';
import { TimetableGrid } from './components/timetable-grid';
import { useTimetable } from './hooks/use-timetable';

export default function Home() {
  const {
    currentYear,
    setCurrentYear,
    currentSemester,
    setCurrentSemester,
    isLoading,
    getCurrentTimetable,
    saveTimeSlot,
    deleteTimeSlot,
    getAvailableYears,
    addNewYear,
  } = useTimetable();

  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのみレンダリングするための対策
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium">読み込み中...</div>
      </div>
    );
  }

  const currentTimetable = getCurrentTimetable();
  const availableYears = getAvailableYears();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center mb-4">大学時間割</h1>
          <SemesterSelector
            currentYear={currentYear}
            currentSemester={currentSemester}
            availableYears={[...new Set([...availableYears, 1, 2, 3, 4])].sort((a, b) => a - b)}
            onYearChange={setCurrentYear}
            onSemesterChange={setCurrentSemester}
            onAddYear={addNewYear}
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl font-medium">読み込み中...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <TimetableGrid
              slots={currentTimetable?.slots || []}
              onSaveSlot={saveTimeSlot}
              onDeleteSlot={deleteTimeSlot}
            />
          </div>
        )}
      </div>

      <footer className="mt-8 py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} 大学時間割アプリ</p>
      </footer>
    </main>
  );
}
