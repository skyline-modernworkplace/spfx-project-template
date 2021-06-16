import React from "react";
import dayjs from "dayjs";

const DATE_FORMAT = "ddd, MMM D";

const getTimeFormat = (date: Date) => (getMinutes(date) === 0 ? "ha" : "h:mma");

export type DateRangeType =
  | "single-day-time"
  | "single-day-times"
  | "single-all-day"
  | "multi-day-time"
  | "multi-all-day";

export function getDateRangeType(start: Date, end?: Date): DateRangeType {
  if (!isValid(start)) return null;

  //single-day-time
  // no end date, start time not midnight
  if (!isValid(end) && !checkIsMidnight(start)) {
    return "single-day-time";
  }

  //"single-all-day"
  // no end date, time is midnight
  if (!isValid(end) && checkIsMidnight(start)) {
    return "single-all-day";
  }

  //single-day-times
  // has end date, start and end are the same day
  if (isValid(end) && checkSameDay(start, end)) {
    return "single-day-times";
  }

  //multi-day-time
  // both start date and end date, start and end are different, both times are not midnight
  if (
    isValid(end) &&
    !checkSameDay(start, end) &&
    !(checkIsMidnight(start) && checkIsMidnight(end))
  ) {
    return "multi-day-time";
  }
  //multi-all-day
  // both start date and end date, start and end are different, both times are midnight
  if (isValid(end) && !checkSameDay(start, end) && checkIsMidnight(start) && checkIsMidnight(end)) {
    return "multi-all-day";
  }
}

const format = (date, formatStr) => {
  return dayjs(date).format(formatStr);
};
const isValid = (date) => dayjs(date).isValid();
const getMinutes = (date) => dayjs(date).get("minute");
const isEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB);
const startOfDay = (date) => dayjs(date).startOf("day");

function checkSameDay(start, end) {
  return isEqual(startOfDay(start), startOfDay(end));
}

function checkIsMidnight(date) {
  return isEqual(startOfDay(date), date);
}

export default function DateRangeText(event: DateRangeTextProps) {
  if (!isValid(event.start)) return null;

  let singleDay =
    (event.start && !event.end) ||
    format(event.start, DATE_FORMAT) === format(event.end || event.start, DATE_FORMAT);

  if (singleDay) {
    // If its a single day and the time is set to 12am, its an all day event?
    return isEqual(startOfDay(event.start), event.start)
      ? renderSingleDayAllDay(event)
      : renderSingleDay(event);
  } else {
    return isEqual(startOfDay(event.start), event.start) &&
      isEqual(startOfDay(event.end), event.end)
      ? renderMultiDayAllDay(event)
      : renderMultiDay(event);
  }
}
const renderSingleDayAllDay = (event) => <span>{format(event.start, DATE_FORMAT)}, All day</span>;
// Single day (not all day) - DATE, STARTTIME - ENDTIME
const renderSingleDay = (event) => (
  <span>
    <span>
      {format(event.start, DATE_FORMAT)}, {format(event.start, getTimeFormat(event.start))}
    </span>
    {isValid(event.end) && (
      <>
        <span> - </span>
        <span>{format(event.end, getTimeFormat(event.end))} </span>
      </>
    )}
  </span>
);
// Multi day all day event, render both dates
const renderMultiDayAllDay = (event) => (
  <span>
    {format(event.start, DATE_FORMAT)} - {format(event.end, DATE_FORMAT)}
  </span>
);
// Multi day event render StartDateTime - EndDateTime
const renderMultiDay = (event) => (
  <span>
    {format(event.start, DATE_FORMAT + ", " + getTimeFormat(event.start))} {" - "}
    {format(event.end, DATE_FORMAT + ", " + getTimeFormat(event.end))}
  </span>
);

export interface DateRangeTextProps {
  start: Date;
  end: Date;
}
