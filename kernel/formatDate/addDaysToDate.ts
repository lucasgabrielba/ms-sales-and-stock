export const addDaysToDate = (date, daysToAdd) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + daysToAdd);
  return newDate;
};