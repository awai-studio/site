import Link from "next/link";
import { requireAdmin } from "@/lib/admin/adminAuth";
import {
  BOOKING_STATUSES,
  formatAdminDateTime,
} from "@/lib/admin/bookingStatus";
import styles from "./Admin.module.scss";

export const metadata = {
  title: "Booking Requests | Awai Studio Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage({ searchParams }) {
  const query = await searchParams;
  const requestedStatus = String(query?.status || "");
  const status = Object.hasOwn(BOOKING_STATUSES, requestedStatus)
    ? requestedStatus
    : "";
  const { supabase } = await requireAdmin();

  let bookingQuery = supabase
    .from("booking_requests")
    .select(
      "id, created_at, experience_slug, customer_name, customer_email, guest_count, preferred_date_1, preferred_time_1, status",
    )
    .order("created_at", { ascending: false });

  if (status) bookingQuery = bookingQuery.eq("status", status);

  const { data: bookings, error } = await bookingQuery;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Operations</p>
          <h1>予約リクエスト</h1>
        </div>
        <span className={styles.total}>{bookings?.length || 0}件</span>
      </div>

      <div className={styles.filters} aria-label="状態で絞り込む">
        <Link className={!status ? styles.activeFilter : undefined} href="/admin">
          すべて
        </Link>
        {Object.entries(BOOKING_STATUSES).map(([value, label]) => (
          <Link
            key={value}
            className={status === value ? styles.activeFilter : undefined}
            href={`/admin?status=${value}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {error ? (
        <p className={styles.error}>予約一覧を取得できませんでした。</p>
      ) : bookings?.length ? (
        <div className={styles.bookingList}>
          {bookings.map((booking) => (
            <article className={styles.bookingCard} key={booking.id}>
              <div className={styles.cardTop}>
                <span data-status={booking.status} className={styles.statusBadge}>
                  {BOOKING_STATUSES[booking.status] || booking.status}
                </span>
                <time>{formatAdminDateTime(booking.created_at)}</time>
              </div>
              <h2>{booking.customer_name}</h2>
              <dl>
                <div>
                  <dt>体験</dt>
                  <dd>{booking.experience_slug}</dd>
                </div>
                <div>
                  <dt>第1希望</dt>
                  <dd>
                    {booking.preferred_date_1} {booking.preferred_time_1} JST
                  </dd>
                </div>
                <div>
                  <dt>人数</dt>
                  <dd>{booking.guest_count}名</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{booking.customer_email}</dd>
                </div>
              </dl>
              <Link className={styles.detailLink} href={`/admin/bookings/${booking.id}`}>
                詳細を見る
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>該当する予約リクエストはありません。</p>
      )}
    </div>
  );
}
