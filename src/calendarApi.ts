import {CalendarEvent, Duration, RecurrenceRule} from './types';
import {applyDifference, isOverlapping, isInFuture, datesOverlap} from './utils/dateUtils';
import {generateOccurrences} from './utils/recurrenceUtils';

export class Calendar {
    private events: CalendarEvent[] = [];

    private doesEventOverlap(newEvent: CalendarEvent): boolean {
        const newOccurrences = newEvent.recurrence ? generateOccurrences(newEvent.duration.start, newEvent.recurrence) : [newEvent.duration.start];

        for (let occurrence of newOccurrences) {
            for (let event of this.events) {
                if (datesOverlap(new Date(occurrence), new Date(occurrence), new Date(event.duration.start), new Date(event.duration.end))) {
                    return true;
                }
            }
        }
        return false;
    }

    createEvent(event: Omit<CalendarEvent, 'id'> & {
        recurrence?: RecurrenceRule
    }, allowOverlap: boolean = false): CalendarEvent | Error {
        const newEvent: CalendarEvent = {...event, id: this.generateId()};

        if (!allowOverlap && this.doesEventOverlap(newEvent)) {
            return new Error('Event overlaps with existing event.');
        }

        if (event.recurrence) {
            const occurrences = generateOccurrences(event.duration.start, event.recurrence);
            const relatedEvents = this.generateId()
            for (const occurrence of occurrences) {
                const newOccurrenceEvent = {
                    id: this.generateId(),
                    title: event.title,
                    duration: {
                        start: occurrence,
                        end: applyDifference({start: event.duration.start, end: event.duration.end}, occurrence)
                    },
                    recurrence: event.recurrence,
                    relatedEvents: relatedEvents
                }
                this.events.push(newOccurrenceEvent);
            }
            return newEvent
        }

        this.events.push(newEvent);
        return newEvent;

    }

    listEvents(dateRange: Duration): CalendarEvent[] {
        return this.events.filter(event =>
            new Date(event.duration.start) >= new Date(dateRange.start) &&
            new Date(event.duration.end) <= new Date(dateRange.end)
        );
    }

    updateEvent(id: string, updateData: Partial<Omit<CalendarEvent, 'id'>>, allowOverlap: boolean = false): CalendarEvent | Error {
        const eventIndex = this.events.findIndex((event: CalendarEvent) => event && event.id === id);
        if (eventIndex === -1) {
            return new Error('Event not found.');
        }

        const updatedEvent = {...this.events[eventIndex], ...updateData};

        if (!allowOverlap) {
            const overlap = this.events.some((event, idx) => idx !== eventIndex && isOverlapping(event.duration, updatedEvent.duration));
            if (overlap) {
                return new Error('Updated event overlaps with an existing event.');
            }
        }

        this.events[eventIndex] = updatedEvent;
        return updatedEvent;
    }

    deleteEvent(id: string, options?: { onlyFuture?: boolean, recurringEvents?: boolean }): boolean {
        const eventIndex = this.events.findIndex(event => event.id === id);
        if (eventIndex === -1) {
            return false;
        }
        if (options?.onlyFuture) {
            this.events.filter(event => {
                return isInFuture(event.duration);
            })
            return true;
        }

        if (options?.recurringEvents) {
            this.events.filter(event =>
                !(!!event.recurrence)
            );
            return true;
        }
        this.events.splice(eventIndex, 1);
        return true;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }
}
