// @/app/admin/bookings/page.jsx

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import styles from "./bookings.module.scss";

const STATUS_LABELS = {
  new: "開催者へ確認中",
  contacted: "開催者へ確認中",
  payment_pending: "決済待ち",
  confirmed: "予約確定",
  cancelled: "キャンセル",
  expired: "決済期限切れ",
};

const HOST_NAMES = {
  "tea-experience-with-soko": "ジャック",
  "zen-experience-with-jirai": "慈頼",
};

function getHostName(experienceSlug) {
  return HOST_NAMES[experienceSlug] || "ホスト";
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getCandidates(booking) {
  return [1, 2, 3]
    .map((index) => ({
      date: booking[`preferred_date_${index}`],
      time: booking[`preferred_time_${index}`]?.slice(0, 5),
    }))
    .filter((item) => item.date && item.time);
}

export default function BookingManagementPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [selections, setSelections] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  const loadBookings = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      router.replace("/admin/login");
      return;
    }

    const { data, error } = await supabase
      .from("booking_requests")
      .select(
        "id, created_at, experience_slug, customer_name, customer_email, guest_count, message, status, preferred_date_1, preferred_time_1, preferred_date_2, preferred_time_2, preferred_date_3, preferred_time_3, selected_date, selected_time, payment_link_sent_at, payment_due_at, confirmed_date, confirmed_time",
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("予約リクエストを取得できませんでした。");
      setIsLoading(false);
      return;
    }

    const rows = data || [];
    setBookings(rows);
    setSelections((current) => {
      const next = { ...current };
      for (const booking of rows) {
        if (!next[booking.id]) {
          const first = getCandidates(booking)[0];
          if (first) next[booking.id] = `${first.date}|${first.time}`;
        }
      }
      return next;
    });
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const activeCount = useMemo(
    () =>
      bookings.filter((booking) =>
        ["new", "contacted", "payment_pending"].includes(booking.status),
      ).length,
    [bookings],
  );

  async function runAction(booking, action) {
    setBusyId(booking.id);
    setMessage("");

    let selectedDate = null;
    let selectedTime = null;

    if (action === "select_date") {
      [selectedDate, selectedTime] = (selections[booking.id] || "").split("|");
      if (!selectedDate || !selectedTime) {
        setMessage("決定する日時を選んでください。");
        setBusyId(null);
        return;
      }
    }

    const { error } = await supabase.rpc("manage_booking_request", {
      p_request_id: booking.id,
      p_action: action,
      p_selected_date: selectedDate,
      p_selected_time: selectedTime,
    });

    if (error) {
      setMessage(`更新できませんでした。${error.message}`);
      setBusyId(null);
      return;
    }

    await loadBookings();
    setBusyId(null);
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className={styles.bookingManagement}>
          <p>予約リクエストを読み込んでいます。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.bookingManagement}>
        <header>
          <div>Booking Operations</div>
          <h1>予約管理</h1>
          <p>対応が必要な予約：{activeCount}件</p>
          <Link href="/admin">管理トップへ戻る</Link>
        </header>

        {message && (
          <div className="formErrorMessage">
            <p>{message}</p>
          </div>
        )}

        {bookings.length === 0 ? (
          <section className={styles.emptyState}>
            <p>予約リクエストはまだありません。</p>
          </section>
        ) : (
          <section className={styles.bookingList}>
            {bookings.map((booking) => {
              const candidates = getCandidates(booking);
              const hostName = getHostName(booking.experience_slug);
              const isChecking = ["new", "contacted"].includes(booking.status);
              const isPaymentPending = booking.status === "payment_pending";
              const isExpired =
                isPaymentPending &&
                booking.payment_due_at &&
                new Date(booking.payment_due_at) <= new Date();

              return (
                <article className={styles.bookingCard} key={booking.id}>
                  <div className={styles.cardHeader}>
                    <span data-status={booking.status}>
                      {isExpired
                        ? "決済期限切れ"
                        : isChecking
                          ? `${hostName}へ確認中`
                        : STATUS_LABELS[booking.status] || booking.status}
                    </span>
                    <small>
                      #{booking.id} / {formatDateTime(booking.created_at)}
                    </small>
                  </div>

                  <h2>{booking.customer_name}</h2>
                  <p>{booking.customer_email}</p>
                  <dl className={styles.details}>
                    <div>
                      <dt>体験</dt>
                      <dd>{booking.experience_slug}</dd>
                    </div>
                    <div>
                      <dt>人数</dt>
                      <dd>{booking.guest_count}名</dd>
                    </div>
                    {booking.message && (
                      <div>
                        <dt>メッセージ</dt>
                        <dd>{booking.message}</dd>
                      </div>
                    )}
                  </dl>

                  <div className={styles.candidates}>
                    <h3>希望日時</h3>
                    <ol>
                      {candidates.map((candidate) => (
                        <li key={`${candidate.date}-${candidate.time}`}>
                          {candidate.date} / {candidate.time}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {isChecking && (
                    <div className={styles.actions}>
                      <label>
                        <span>{hostName}と決めた日時</span>
                        <select
                          value={selections[booking.id] || ""}
                          onChange={(event) =>
                            setSelections((current) => ({
                              ...current,
                              [booking.id]: event.target.value,
                            }))
                          }
                        >
                          {candidates.map((candidate) => (
                            <option
                              value={`${candidate.date}|${candidate.time}`}
                              key={`${candidate.date}-${candidate.time}`}
                            >
                              {candidate.date} / {candidate.time}
                            </option>
                          ))}
                        </select>
                      </label>
                      <p>
                        決済案内を送った直後に押してください。ここから48時間を数えます。
                      </p>
                      <button
                        type="button"
                        disabled={busyId === booking.id}
                        onClick={() => runAction(booking, "select_date")}
                      >
                        この日時に決定して決済待ちへ
                      </button>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        disabled={busyId === booking.id}
                        onClick={() => runAction(booking, "cancel")}
                      >
                        キャンセルして候補日を解放
                      </button>
                    </div>
                  )}

                  {isPaymentPending && (
                    <div className={styles.actions}>
                      <p className={styles.selectedDate}>
                        決定日：{booking.selected_date} /{" "}
                        {booking.selected_time?.slice(0, 5)}
                      </p>
                      <p>決済期限：{formatDateTime(booking.payment_due_at)}</p>
                      {!isExpired && (
                        <button
                          type="button"
                          disabled={busyId === booking.id}
                          onClick={() => runAction(booking, "confirm")}
                        >
                          支払い完了・予約確定
                        </button>
                      )}
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        disabled={busyId === booking.id}
                        onClick={() =>
                          runAction(booking, isExpired ? "expire" : "cancel")
                        }
                      >
                        {isExpired
                          ? "期限切れとして解放"
                          : "キャンセルして解放"}
                      </button>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className={styles.actions}>
                      <p className={styles.selectedDate}>
                        確定日：{booking.confirmed_date} /{" "}
                        {booking.confirmed_time?.slice(0, 5)}
                      </p>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        disabled={busyId === booking.id}
                        onClick={() => runAction(booking, "cancel")}
                      >
                        予約をキャンセルして日付を解放
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
