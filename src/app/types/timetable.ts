// 1コマ分の授業
export type TimeSlot = {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  period: number;
  subject: string;
  teacher?: string;
  room?: string;
  color?: string;
  memo?: string;
};

// 時間割データ（学年・学期ごと）
export type Timetable = {
  year: number; // 学年
  semester: '前期' | '後期';
  slots: TimeSlot[];
};

// 全体データ（localStorage用）
export type TimetableStore = Timetable[];
