export function SessionsList({ sessions }) {
    if (!sessions.length) {
        return (<section className="empty-state panel">
          <h2>No sessions yet</h2>
          <p>Create your first session to start taking bookings. Sessions appear on your public booking page.</p>
        </section>);
    }
    return (<div className="table">
      {sessions.map((session) => (<div className="row" key={session.id}>
          <span>{session.session_date}</span>
          <span>{session.start_time.slice(0, 5)}-{session.end_time.slice(0, 5)} · {session.session_type ?? 'Group Lesson'}</span>
          <span>{session.current_bookings}/{session.max_capacity} · {session.status ?? 'scheduled'}</span>
        </div>))}
    </div>);
}
