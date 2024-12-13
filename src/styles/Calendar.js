import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export const StyledCalendarWrapper = styled.div`
  width: 320px;
  display: flex;
  justify-content: center;
  position: relative;
  color: #fff;
`;

export const StyledCalendar = styled(Calendar)`
  width: 100%;
  padding: 15px;
  background-color: rgba(14, 14, 14, 0.7);
  border-radius: 15px;
  color: #fff;
  border: none;

  button {
    color: #fff;
  }
  .react-calendar__month-view__weekdays {
    color: #fff;
    abbr {
      text-decoration: none;
    }
  }

  .react-calendar__tile {
    color: #fff;

    &:enabled:hover,
    &:enabled:focus {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  .react-calendar__navigation__label:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: white !important; /* 텍스트 색상 */
  }
  .react-calendar__navigation__label {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: white !important; /* 텍스트 색상 */
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: rgba(255, 255, 255, 0.5);
  }

  .react-calendar__navigation button {
    color: #fff;

    &:enabled:hover,
    &:enabled:focus {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .react-calendar__tile--now {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .react-calendar__tile--active {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;
