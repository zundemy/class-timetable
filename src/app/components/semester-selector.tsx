'use client';

import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface SemesterSelectorProps {
  currentYear: number;
  currentSemester: '前期' | '後期';
  availableYears: number[];
  onYearChange: (year: number) => void;
  onSemesterChange: (semester: '前期' | '後期') => void;
  onAddYear?: (year: number) => void;
}

export function SemesterSelector({
  currentYear,
  currentSemester,
  availableYears,
  onYearChange,
  onSemesterChange,
  onAddYear,
}: SemesterSelectorProps) {
  // モーダルの表示状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 新しい学年の入力値
  const [newYear, setNewYear] = useState<string>('');

  // 学年が選択されたとき
  const handleYearChange = (value: string) => {
    onYearChange(parseInt(value, 10));
  };

  // 学年追加ボタンがクリックされたとき
  const handleAddYearClick = () => {
    setIsModalOpen(true);
  };

  // 学年追加モーダルで保存ボタンがクリックされたとき
  const handleSaveNewYear = () => {
    const yearNumber = parseInt(newYear, 10);
    if (isNaN(yearNumber) || yearNumber <= 0) {
      alert('有効な学年を入力してください');
      return;
    }

    if (onAddYear) {
      onAddYear(yearNumber);
    }
    
    setIsModalOpen(false);
    setNewYear('');
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">学年:</span>
          <Select value={currentYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="学年" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year: number) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {onAddYear && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddYearClick}
              className="ml-2"
            >
              +
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={currentSemester === '前期' ? 'default' : 'outline'}
            onClick={() => onSemesterChange('前期')}
            className="w-20"
          >
            前期
          </Button>
          <Button
            variant={currentSemester === '後期' ? 'default' : 'outline'}
            onClick={() => onSemesterChange('後期')}
            className="w-20"
          >
            後期
          </Button>
        </div>
      </div>

      {/* 学年追加モーダル */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新しい学年を追加</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right">学年:</span>
              <Input
                type="number"
                min="1"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="例: 5"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveNewYear}>
              追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
