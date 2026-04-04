export default function AdminBookings() {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-2xl font-bold text-stone-900">Booking Operations</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
        Booking moderation screens are still pending on the frontend. The admin API is available
        at `/api/admin/bookings` and `/api/admin/bookings/:id/status`; this placeholder prevents
        broken imports and gives the route a stable landing page.
      </p>
    </section>
  );
}
