import {Calendar, CalendarEvent} from '../src';

describe('Calendar', () => {
    let calendar: Calendar;

    beforeEach(() => {
        calendar = new Calendar();
    });

    test('should create an event successfully', () => {
        const event: Omit<CalendarEvent, 'id'> = {
            title: 'Test Event',
            duration: {
                start: '2024-03-01T10:00:00.000Z',
                end: '2024-03-01T11:00:00.000Z',
            },
        };
        const createdEvent = calendar.createEvent(event, false);

        expect(createdEvent).toHaveProperty('id');
        expect(createdEvent).toMatchObject(event);
    });

    test('should prevent overlapping events if not explicitly allowed', () => {
        const event1: Omit<CalendarEvent, 'id'> = {
            title: 'Event 1',
            duration: {
                start: '2024-03-01T10:00:00.000Z',
                end: '2024-03-01T11:00:00.000Z',
            },
        };

        const event2: Omit<CalendarEvent, 'id'> = {
            title: 'Event 2',
            duration: {
                start: '2024-03-01T10:30:00.000Z',
                end: '2024-03-01T11:30:00.000Z',
            },
        };

        calendar.createEvent(event1, false);
        const attemptToCreateOverlappingEvent = calendar.createEvent(event2, false);

        expect(attemptToCreateOverlappingEvent).toBeInstanceOf(Error);
    });

    test('should list events within a given date range', () => {
        const event1: Omit<CalendarEvent, 'id'> = {
            title: 'Event 1',
            duration: {
                start: '2024-03-01T10:00:00.000Z',
                end: '2024-03-01T11:00:00.000Z',
            },
        };

        const event2: Omit<CalendarEvent, 'id'> = {
            title: 'Event 2',
            duration: {
                start: '2024-03-02T12:00:00.000Z',
                end: '2024-03-02T13:00:00.000Z',
            },
        };

        calendar.createEvent(event1, false);
        calendar.createEvent(event2, false);

        const eventsInRange = calendar.listEvents({
            start: '2024-03-01T00:00:00.000Z',
            end: '2024-03-01T23:59:59.999Z',
        });

        expect(eventsInRange.length).toBe(1);
        expect(eventsInRange[0]).toMatchObject(event1);
    });


    test('should update an event successfully', () => {
        const event = calendar.createEvent({
            title: 'Initial Event',
            duration: {start: '2024-03-01T10:00:00.000Z', end: '2024-03-01T11:00:00.000Z'},
        }, false);

        if (!(event instanceof Error)) {
            const updated = calendar.updateEvent(event.id, {
                title: 'Updated Event',
            }, false);

            expect(updated).not.toBeInstanceOf(Error);
            if ("title" in updated) {
                expect(updated.title).toBe('Updated Event');
            }
        }
    });

    test('should create an event with recurrence daily with count 2 successfully', () => {
        const event = calendar.createEvent({
            title: 'Initial Event with recurrence',
            duration: {start: '2024-03-01T10:00:00.000Z', end: '2024-03-01T11:00:00.000Z'},
            recurrence:
                {
                    frequency: 'DAILY',
                    count: 2
                }
        }, false);
        const eventsInRange = calendar.listEvents({
            start: '2024-03-01T00:00:00.000Z',
            end: '2024-05-01T23:59:59.999Z',
        });

        if (!(event instanceof Error)) {
            expect(eventsInRange).not.toBeInstanceOf(Error);
            expect(eventsInRange.length).toBe(2);
        }
    });

    test('should delete an event successfully', () => {
        const event = calendar.createEvent({
            title: 'Event to Delete',
            duration: {start: '2024-03-01T10:00:00.000Z', end: '2024-03-01T11:00:00.000Z'},
        }, false);

        if (!(event instanceof Error)) {
            const deleted = calendar.deleteEvent(event.id);
            expect(deleted).toBe(true);
            expect(calendar.listEvents({start: '2024-01-01T00:00:00.000Z', end: '2024-12-31T23:59:59.999Z'})).not.toContainEqual(expect.objectContaining({id: event.id}));
        }
    });

    test('should delete all events with recurrence daily with count 2 successfully', () => {
        const event = calendar.createEvent({
            title: 'Initial Event with recurrence',
            duration: {start: '2024-03-01T10:00:00.000Z', end: '2024-03-01T11:00:00.000Z'},
            recurrence:
                {
                    frequency: 'DAILY',
                    count: 2
                }
        }, false);
        const eventsInRange = calendar.listEvents({
            start: '2024-03-01T00:00:00.000Z',
            end: '2024-05-01T23:59:59.999Z',
        });

        if (!(event instanceof Error)) {
            expect(eventsInRange).not.toBeInstanceOf(Error);
            expect(eventsInRange.length).toBe(2);
            const deleted = calendar.deleteEvent(event.id);
            if(deleted){
                expect(eventsInRange.length).toBe(0);
            }
        }
    });

    test('should prevent update to an overlapping event if not explicitly allowed', () => {
        const event1 = calendar.createEvent({
            title: 'Event 1',
            duration: {start: '2024-03-01T10:00:00.000Z', end: '2024-03-01T11:00:00.000Z'},
        }, false);

        const event2 = calendar.createEvent({
            title: 'Event 2',
            duration: {start: '2024-03-01T12:00:00.000Z', end: '2024-03-01T13:00:00.000Z'},
        }, false);

        if (!(event1 instanceof Error) && !(event2 instanceof Error)) {
            const updateResult = calendar.updateEvent(event2.id, {
                duration: {start: '2024-03-01T10:30:00.000Z', end: '2024-03-01T11:30:00.000Z'}
            }, false);

            expect(updateResult).toBeInstanceOf(Error);
        }
    });

});
