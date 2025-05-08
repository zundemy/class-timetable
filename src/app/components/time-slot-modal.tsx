'use client';

import { useState } from 'react';
import { TimeSlot } from '../types/timetable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: TimeSlot['day'];
  period: number;
  initialData?: TimeSlot;
  onSave: (slot: TimeSlot) => void;
  onDelete: (day: TimeSlot['day'], period: number) => void;
}

// 利用可能な色のリスト
const COLOR_OPTIONS = [
  { value: 'bg-blue-100', label: '青' },
  { value: 'bg-green-100', label: '緑' },
  { value: 'bg-yellow-100', label: '黄' },
  { value: 'bg-red-100', label: '赤' },
  { value: 'bg-purple-100', label: '紫' },
  { value: 'bg-pink-100', label: 'ピンク' },
  { value: 'bg-indigo-100', label: '藍' },
  { value: 'bg-orange-100', label: 'オレンジ' },
];

// 曜日の日本語表記
const DAY_LABELS: Record<TimeSlot['day'], string> = {
  Mon: '月',
  Tue: '火',
  Wed: '水',
  Thu: '木',
  Fri: '金',
};

export function TimeSlotModal({
  isOpen,
  onClose,
  day,
  period,
  initialData,
  onSave,
  onDelete,
}: TimeSlotModalProps) {
  // フォームの状態
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [teacher, setTeacher] = useState(initialData?.teacher || '');
  const [room, setRoom] = useState(initialData?.room || '');
  const [memo, setMemo] = useState(initialData?.memo || '');
  const [color, setColor] = useState(initialData?.color || 'bg-white');

  // 保存ボタンがクリックされたとき
  const handleSave = () => {
    if (!subject.trim()) {
      alert('科目名を入力してください');
      return;
    }

    const slot: TimeSlot = {
      day,
      period,
      subject: subject.trim(),
      teacher: teacher.trim() || undefined,
      room: room.trim() || undefined,
      memo: memo.trim() || undefined,
      color: color === 'bg-white' ? undefined : color,
    };

    onSave(slot);
  };

  // 削除ボタンがクリックされたとき
  const handleDelete = () => {
    if (confirm('この授業を削除してもよろしいですか？')) {
      onDelete(day, period);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {DAY_LABELS[day]}曜{period}限の授業
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              科目名 *
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
              placeholder="必須"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">
              教員
            </Label>
            <Input
              id="teacher"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              className="col-span-3"
              placeholder="任意"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room" className="text-right">
              教室
            </Label>
            <Input
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="col-span-3"
              placeholder="任意"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="memo" className="text-right">
              メモ
            </Label>
            <Input
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="col-span-3"
              placeholder="任意"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">色</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              <button
                type="button"
                className={`w-8 h-8 rounded-full border ${
                  color === 'bg-white' ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
                onClick={() => setColor('bg-white')}
              />
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`w-8 h-8 rounded-full ${option.value} ${
                    color === option.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setColor(option.value)}
                  title={option.label}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          {initialData && (
            <Button variant="destructive" onClick={handleDelete}>
              削除
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
