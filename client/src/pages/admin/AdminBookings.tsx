export default function AdminBookings() {
  return (
    <section className="travel-panel rounded-[2rem] p-6">
      <h2 className="font-heading text-3xl font-bold text-ink-900">Booking Operations</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-700/72">
        Booking moderation screens are still pending on the frontend. The admin API is available
        at `/api/admin/bookings` and `/api/admin/bookings/:id/status`; this placeholder prevents
        broken imports and gives the route a stable landing page.
      </p>
    </section>
  );
}
