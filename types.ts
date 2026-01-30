
export enum Category {
  STUDY = 'Study',
  WORK = 'Work',
  SOCIAL = 'Social',
  REST = 'Rest',
  GAMING = 'Gaming',
  OTHER = 'Other'
}

export interface Task {
  id: string;
  title: string;
  duration: number; // in minutes
  category: Category;
  startTime?: string; // HH:mm format, auto-calculated
  endTime?: string;   // HH:mm format, auto-calculated
  isRaw: boolean;     // True if in "Raw Planning" section
}

export interface UserProfile {
  name: string;
  dayStart: string; // HH:mm
}
