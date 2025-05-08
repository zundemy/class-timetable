'use client';

import { useState } from 'react';
import { TimeSlot } from '../types/timetable';
import { TimeSlotModal } from './time-slot-modal';

interface TimetableGridProps {
  slots: TimeSlot[];
  onSaveSlot: (slot: TimeSlot) => void;
  onDeleteSlot: (day: TimeSlot['day'], period: number) => void;
}

// 曜日の定義
const DAYS: TimeSlot['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAY_LABELS: Record<TimeSlot['day'], string> = {
  Mon: '月',
  Tue: '火',
  Wed: '水',
  Thu: '木',
  Fri: '金',
};

// 時限の定義（1〜7限）
const PERIODS = [1, 2, 3, 4, 5, 6, 7];

export function TimetableGrid({ slots, onSaveSlot, onDeleteSlot }: TimetableGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<TimeSlot['day'] | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

  // 特定の曜日・時限のスロットを取得
  const getSlot = (day: TimeSlot['day'], period: number): TimeSlot | undefined => {
    return slots.find((slot) => slot.day === day && slot.period === period);
  };

  // セルがクリックされたとき
  const handleCellClick = (day: TimeSlot['day'], period: number) => {
    setSelectedDay(day);
    setSelectedPeriod(period);
    setIsModalOpen(true);
  };

  // モーダルが閉じられたとき
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
    setSelectedPeriod(null);
  };

  // 授業が保存されたとき
  const handleSaveSlot = (slot: TimeSlot) => {
    onSaveSlot(slot);
    handleCloseModal();
  };

  // 授業が削除されたとき
  const handleDeleteSlot = (day: TimeSlot['day'], period: number) => {
    onDeleteSlot(day, period);
    handleCloseModal();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border bg-gray-100 w-16"></th>
              {DAYS.map((day) => (
                <th key={day} className="p-2 border bg-gray-100 w-1/5">
                  {DAY_LABELS[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period) => (
              <tr key={period}>
                <td className="p-2 border bg-gray-50 text-center font-medium">
                  {period}
                </td>
                {DAYS.map((day) => {
                  const slot = getSlot(day, period);
                  const bgColor = slot?.color || 'bg-white';
                  
                  return (
                    <td
                      key={`${day}-${period}`}
                      className={`p-2 border ${bgColor} hover:bg-gray-50 cursor-pointer transition-colors h-24 sm:h-28`}
                      onClick={() => handleCellClick(day, period)}
                    >
                      {slot && (
                        <div className="flex flex-col h-full">
                          <div className="font-medium text-sm sm:text-base truncate">
                            {slot.subject}
                          </div>
                          {slot.room && (
                            <div className="text-xs sm:text-sm text-gray-600 truncate">
                              {slot.room}
                            </div>
                          )}
                          {slot.teacher && (
                            <div className="text-xs sm:text-sm text-gray-600 truncate">
                              {slot.teacher}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedDay && selectedPeriod !== null && (
        <TimeSlotModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          day={selectedDay}
          period={selectedPeriod}
          initialData={getSlot(selectedDay, selectedPeriod)}
          onSave={handleSaveSlot}
          onDelete={handleDeleteSlot}
        />
      )}
    </>
  );
}
