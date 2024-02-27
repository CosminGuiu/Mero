import { RecurrenceRule, DateString } from '../types';

const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
const addWeeks = (date: Date, weeks: number): Date => addDays(date, weeks * 7);
const addMonths = (date: Date, months: number): Date => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + months);
    return newDate;
};

export const generateOccurrences = (start: DateString, rule: RecurrenceRule, until?: DateString): DateString[] => {
    const occurrences: DateString[] = [];
    let currentDate = new Date(start);
    const endDate = until ? new Date(until) : null;

    while (true) {
        if (endDate && currentDate > endDate) break;
        if (rule.count !== undefined && occurrences.length >= rule.count) break;
        if (rule.until && currentDate > new Date(rule.until)) break;

        occurrences.push(currentDate.toISOString());

        switch (rule.frequency) {
            case 'DAILY':
                currentDate = addDays(currentDate, 1);
                break;
            case 'WEEKLY':
                currentDate = addWeeks(currentDate, 1);
                break;
            case 'MONTHLY':
                currentDate = addMonths(currentDate, 1);
                break;
        }
    }

    return occurrences;
};
