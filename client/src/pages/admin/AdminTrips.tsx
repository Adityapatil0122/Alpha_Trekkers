export default function AdminTrips() {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-2xl font-bold text-stone-900">Trip Management</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
        The admin trip editor is not wired yet, but the backend CRUD routes already exist under
        `/api/trips` for authenticated admins. This placeholder keeps the route tree intact while
        the UI layer is finished.
      </p>
    </section>
  );
}
