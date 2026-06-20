import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface Meeting {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function MeetingCalendar({ meetings }: { meetings: Meeting[] }) {
  const events = meetings.map((m) => ({
    id: m._id,
    title: `${m.title} (${m.status})`,
    start: new Date(m.startTime),
    end: new Date(m.endTime),
    status: m.status,
  }));

  const eventStyle = (event: any) => ({
    style: {
      backgroundColor:
        event.status === "accepted" ? "#16a34a" :
        event.status === "rejected" ? "#dc2626" : "#ca8a04",
      borderRadius: "4px",
      color: "white",
    },
  });

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyle}
      />
    </div>
  );
}