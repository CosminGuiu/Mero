import {CalendarEvent, DateString, Duration} from "../types";
import {generateOccurrences} from "./recurrenceUtils";

export const isOverlapping = (duration1: Duration, duration2: Duration): boolean => {
    const start1 = new Date(duration1.start).getTime();
    const end1 = new Date(duration1.end).getTime();
    const start2 = new Date(duration2.start).getTime();
    const end2 = new Date(duration2.end).getTime();

    return start1 < end2 && start2 < end1;
};

export const datesOverlap = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => {
    return start1 < end2 && start2 < end1;
}


export const isInFuture = (duration: Duration): boolean => {
    const today = new Date().getTime();
    const start = new Date(duration.start).getTime();

    return start > today;
};

export const applyDifference = (duration: Duration, currentDate: DateString): DateString => {
    const startDateObj = new Date(duration.start);
    const endDateObj = new Date(duration.end);
    const newDateObj = new Date(currentDate);
    const difference = endDateObj.getTime() - startDateObj.getTime();

    const newEndDateObj = new Date(newDateObj.getTime() + difference);

    return newEndDateObj.toISOString();
}
