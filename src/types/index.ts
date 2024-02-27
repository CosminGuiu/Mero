export type DateString = string;
export interface Duration {
    start: DateString;
    end: DateString;
}

export interface RecurrenceRule {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    count?: number;
    until?: DateString;
}

export interface CalendarEvent {
    id: string;
    title: string;
    duration: Duration;
    recurrence?: RecurrenceRule;
    relatedEvents?: string // for every related events we store here the data
}
