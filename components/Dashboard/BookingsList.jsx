export function BookingsList({ bookings }) {
    if (!bookings.length) {
        return (<section className="empty-state panel">
          <h2>No bookings yet</h2>
          <p>Share your booking page link on Instagram, your website, or print a QR code for your shop counter.</p>
        </section>);
    }
    return (<div className="table">
      {bookings.map((booking) => (<div className="row" key={booking.id}>
          <span>{booking.customer_name}</span>
          <span>{booking.customer_email}</span>
          <span>{booking.participants ?? 1} participant(s) · {booking.status}</span>
        </div>))}
    </div>);
}
