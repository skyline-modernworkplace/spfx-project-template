import React from "react";
import styled from "ui-toolkit/styled-components";
import { getThemeValue } from "../PortalsThemeProvider/PortalsThemeProvider";
import dayjs from "dayjs";

const CLASS_NAME = "big-date";
const DATE_FORMAT = "EEE, MMM do";

const format = (date, formatStr) => {
  return dayjs(date).format(formatStr);
};
export function BigDate({ date = new Date(), className = "", ...rest }: BigDateProps) {
  if (!dayjs(date).isValid()) {
    //console.log("BigDate: Invalid Date");
    return null;
  }
  let cssClass = [CLASS_NAME, className].filter(Boolean).join(" ");
  return (
    <StyledBigDate className={cssClass} {...rest}>
      <div className="month">{format(date, "MMM")}</div>
      <div className="date">{format(date, "D")}</div>
    </StyledBigDate>
  );
}

export function BigDateRange({
  start = new Date(),
  end,
  className = "",
  ...rest
}: BigDateRangeProps) {
  if (!dayjs(start).isValid()) {
    return null;
  }
  let singleDay =
    (start && !end) || format(start, DATE_FORMAT) === format(end || start, DATE_FORMAT);
  let cssClass = [CLASS_NAME, className].filter(Boolean).join(" ");

  if (singleDay) {
    return <BigDate date={start} className={className} {...rest} />;
  }

  return (
    <StyledBigMultiDate className={cssClass} {...rest}>
      <div className="start">
        <span className="month">{format(start, "MMM")} </span>
        <span className="date">{format(start, "D")}</span>
      </div>
      <div className="divider"></div>
      <div className="end">
        <span className="month">{format(end, "MMM")} </span>
        <span className="date">{format(end, "D")}</span>
      </div>
    </StyledBigMultiDate>
  );
}

export const StyledBigDate = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  color: #fff;
  font-size: 18px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  > * {
    position: relative;
  }
  .month {
    text-transform: uppercase;
    font-weight: 300;
    font-size: 1em;
    line-height: 0.8em;
  }
  .date {
    font-size: 2em;
    line-height: 0.85em;
    font-weight: 600;
  }
`;

const StyledBigMultiDate = styled(StyledBigDate)`
  .divider {
    width: 55%;
    height: 0.5px;
    background: #fff;
    margin: 12px 0;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
  .start > *,
  .end > * {
    text-transform: uppercase;
    font-weight: 300;
    font-size: 0.9em;
  }
`;

export interface BigDateProps {
  /** The Date to display */
  date: Date;
  /** An optional class name to help with style overrides */
  className?: string;
  [key: string]: any;
}

export interface BigDateRangeProps {
  /** The start date, the date that displays if there is no end date */
  start: Date;
  /** The end date is optional, if not passed a BigDate component will render */
  end?: Date;
  /** An optional class name to help with style overrides */
  className?: string;
  [key: string]: any;
}
