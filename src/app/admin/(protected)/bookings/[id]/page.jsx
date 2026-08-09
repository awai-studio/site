import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/adminAuth";
import {
  BOOKING_STATUSES,
  formatAdminDateTime,
} from "@/lib/admin/bookingStatus";
import { updateBookingStatus } from "../actions";
import styles from "../../Admin.module.scss";

export const metadata = {
  title: "Booking Detail | Awai Studio Admin",
  robots: { index: false, follow: false },
};

export default async function BookingDetailPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase, admin } = await requireAdmin();
  const { data: booking, error } = await supabase
    .from("booking_requests")
    .select(
      "id, created_at, updated_at, experience_slug, customer_name, customer_email, guest_count, message, status, preferred_date_1, preferred_time_1, preferred_date_2, preferred_time_2, preferred_date_3, preferred_time_3, status_changed_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !booking) notFound();

  const preferences = [1, 2, 3]
    .map((number) => ({
      number,
      date: booking[`preferred_date_${number}`],
      time: booking[`preferred_time_${number}`],
    }))
    .filter((item) => item.date && item.time);

  return (
    <div>
      <Link className={styles.backLink} href="/admin">
        ← 一覧へ戻る
      </Link>

      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Booking detail</p>
          <h1>{booking.customer_name}</h1>
        </div>
        <span data-status={booking.status} className={styles.statusBadge}>
          {BOOKING_STATUSES[booking.status] || booking.status}
        </span>
      </div>

      {query?.saved === "1" && (
        <p className={styles.success}>対応状態を保存しました。</p>
      )}
      {query?.error === "save" && (
        <p className={styles.error}>対応状態を保存できませんでした。</p>
      )}

      <div className={styles.detailGrid}>
        <section className={styles.detailSection}>
          <h2>お客様情報</h2>
          <dl className={styles.detailList}>
            <div><dt>氏名</dt><dd>{booking.customer_name}</dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${booking.customer_email}`}>{booking.customer_email}</a></dd></div>
            <div><dt>人数</dt><dd>{booking.guest_count}名</dd></div>
            <div><dt>受付日時</dt><dd>{formatAdminDateTime(booking.created_at)}</dd></div>
            <div><dt>体験</dt><dd>{booking.experience_slug}</dd></div>
          </dl>
        </section>

        <section className={styles.detailSection}>
          <h2>希望日時</h2>
          <ol className={styles.preferences}>
            {preferences.map((item) => (
              <li key={item.number}>
                <span>第{item.number}希望</span>
                <strong>{item.date} {item.time} JST</strong>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.detailSection}>
          <h2>メッセージ</h2>
          <p className={styles.customerMessage}>{booking.message || "（メッセージなし）"}</p>
        </section>

        <section className={styles.detailSection}>
          <h2>対応状態</h2>
          {admin.role === "editor" ? (
            <form className={styles.statusForm} action={updateBookingStatus}>
              <input type="hidden" name="bookingId" value={booking.id} />
              <select name="status" defaultValue={booking.status}>
                {Object.entries(BOOKING_STATUSES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button type="submit">状態を保存</button>
            </form>
          ) : (
            <p className={styles.readOnly}>閲覧権限のため変更できません。</p>
          )}
          <p className={styles.changedAt}>
            最終変更：{formatAdminDateTime(booking.status_changed_at)}
          </p>
        </section>
      </div>
    </div>
  );
}
