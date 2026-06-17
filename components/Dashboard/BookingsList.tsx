type Booking = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: string;
  created_at: string;
};

export function BookingsList({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="table">
      {bookings.map((booking) => (
        <div className="row" key={booking.id}>
          <span>{booking.customer_name}</span>
          <span>{booking.customer_email}</span>
          <span>{booking.status}</span>
        </div>
      ))}
    </div>
  );
}
