import React from "react";
import { StyledCalendarWrapper, StyledCalendar } from "../styles/Calendar";
import moment from "moment";
import useStore from "../store";

const Calendar = () => {
  const { date, setDate } = useStore();

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <StyledCalendarWrapper>
      <StyledCalendar
        value={date}
        onChange={handleDateChange}
        formatDay={(locale, date) => moment(date).format("D")}
        formatYear={(locale, date) => moment(date).format("YYYY")}
        formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
      />
    </StyledCalendarWrapper>
  );
};

export default Calendar;
