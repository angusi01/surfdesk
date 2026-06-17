type Session = {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_bookings: number;
};

export function SessionsList({ sessions }: { sessions: Session[] }) {
  return (
    <div className="table">
      {sessions.map((session) => (
        <div className="row" key={session.id}>
          <span>{session.session_date}</span>
          <span>{session.start_time.slice(0, 5)}-{session.end_time.slice(0, 5)}</span>
          <span>{session.current_bookings}/{session.max_capacity}</span>
        </div>
      ))}
    </div>
  );
}
