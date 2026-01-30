
export const minutesToTime = (totalMinutes: number): string => {
  const normalizedMinutes = totalMinutes % (24 * 60);
  const hours = Math.floor(normalizedMinutes / 60);
  const mins = normalizedMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const timeToMinutes = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
};

export const calculateBlocks = (tasks: any[], startFrom: string) => {
  let currentMinutes = timeToMinutes(startFrom);
  
  return tasks.map(task => {
    const startTime = minutesToTime(currentMinutes);
    currentMinutes += task.duration;
    const endTime = minutesToTime(currentMinutes);
    
    return {
      ...task,
      startTime,
      endTime
    };
  });
};
