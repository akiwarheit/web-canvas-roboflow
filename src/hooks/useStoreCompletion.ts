/**
 * @TODO - These are all mocks - we still don't have designs yet.
 */

import moment from "moment";

interface StoreCompletionType {
    color: string,
    tooltip: string
}

function randomColor() {
    const colors = ['emerald', 'red', 'orange']
    return colors[Math.floor(Math.random() * 2)];
}

export default function useStoreCompletion() {
    const currentMonthDates: StoreCompletionType[] = new Array(moment().daysInMonth()).fill(null).map((x, i) => moment().startOf('month').add(i, 'days')).map(date => ({
        color: randomColor(),
        tooltip: date.toISOString()
    }));
    return currentMonthDates
}