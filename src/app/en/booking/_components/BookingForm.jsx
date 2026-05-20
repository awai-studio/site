// @/app/en/booking/_components/BookingForm.jsx

"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import styles from "./BookingForm.module.scss";

// 予約する日
// フォームに入力している『日』が重要。
// setHours関数の引数に0を設定することで、
// それぞれ、時、分、秒、ミリ秒を『0』で初期化する。
function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

// 『7日前なのか』『90日以降なのか』という条件で
// 日付が必要になるので設定しる関数。
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// 日付をフォーマットして日付を設定する関数。
// 二桁設定で、数字が一桁のときは、前に『ゼロ』をおく。
function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 日付を比較して同じ文字列であれば真を返す。
function isSameDate(date, dateString) {
  return formatDateKey(date) === dateString;
}

// このコンポーネントの主役
// フォームを返して、入力された値をDBに渡す。
export default function BookingForm({ experience }) {
  // Stateを初期化する。
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // experiencesのキー
  // ここに、データの種類は何タイプ？　利用可能な希望の曜日は？　希望の開催時間はいつ？
  // 開催できない日付はいつ？　というデータが入っている。
  const availability = experience.availability || {};
  // 利用可能な曜日
  const availableWeekdays = availability.availableWeekdays || [];
  // 利用不可の日付
  const unavailableDates = availability.unavailableDates || [];
  // 利用時間の選択肢
  const timeSlots = availability.timeSlots || [];
  // フォームに入力している日付を取得
  const today = startOfDay(new Date());
  // 今日から7日後以降を予約可能にするため、その基準日を取得。
  const minSelectableDate = startOfDay(addDays(today, 7));
  // 今日の日付から90日間予約受付を行う、その基準日を取得。
  const maxSelectableDate = startOfDay(addDays(today, 90));
  // 選択された日付は無効かどうか？
  // 全ての条件をクリアして真が変える。
  function isDateDisabled(date) {
    const targetDate = startOfDay(date);
    const day = targetDate.getDay();
    // ターゲットの日付は、7日制限をクリアしているか？
    const isBeforeMinDate = targetDate < minSelectableDate;
    // ターゲットの日付は90日制限をクリアしているか？
    const isAfterMaxDate = targetDate > maxSelectableDate;
    // ターゲットの日付は利用可能曜日以外を指定していないか？
    const isUnavailableWeekday = !availableWeekdays.includes(day);
    // ターゲットの日付は利用不可日か？
    const isUnavailableDate = unavailableDates.some((dateString) => {
      return isSameDate(targetDate, dateString);
    });

    return (
      isBeforeMinDate ||
      isAfterMaxDate ||
      isUnavailableWeekday ||
      isUnavailableDate
    );
  }
  // form が submit された時に動く関数
  // 送信用の非同期関数
  async function handleSubmit(event) {
    // フォーム送信時にブラウザ標準のページ遷移・画面リロードを止める。
    // リロードされると React の state や画面状態がリセットされるため。
    // state を保持したまま画面更新したいので。
    event.preventDefault();
    // 『event』の中身は、Reactのイベントオブジェクト。
    // どの要素でイベントが起きたかについての情報が入っている。
    // 『currentTarget』は、情報を呼び出すメソッド。
    // 現在注目している要素は何かを示す。
    const formElement = event.currentTarget;

    try {
      // 状態を送信中に切り替える。
      setIsSubmitting(true);
      // ここに来るまでの前の状態が、
      // true, false, nullのいずれかなのでこちらで一旦初期化する。
      setSubmitStatus(null);
      // FormDataクラスは、ブラウザが持っている Web API のクラス。
      // つまり、ブラウザが提供している機能を使ってインスタンスを作っている。
      const formData = new FormData(formElement);
      // // 入力フォームに入った属性の値を
      // // DB呼び出して、インサートする命令を出している。
      // await createBookingRequest({
      //   experienceSlug: experience.slug,
      //   customerName: formData.get("name"),
      //   customerEmail: formData.get("email"),
      //   guestCount: Number(formData.get("guestCount")),
      //   preferredDate: formData.get("preferredDate"),
      //   preferredTime: formData.get("preferredTime"),
      //   message: formData.get("message"),
      // });
      // Resend設定でメール送信の道ができたので、直接DBにアクセスするのはやめて
      //      BookingForm.jsx
      //      ↓
      //      fetch("/api/booking-request")
      //      ↓
      //      route.js
      //      ↓
      //      Supabase insert
      //      ↓
      //      Resend mail
      // 以下のように設定する。
      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experienceSlug: experience.slug,
          experienceTitle: experience.title,
          customerName: formData.get("name"),
          customerEmail: formData.get("email"),
          guestCount: Number(formData.get("guestCount")),
          preferredDate: formData.get("preferredDate"),
          preferredTime: formData.get("preferredTime"),
          message: formData.get("message"),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send booking request.")
      }

      setSubmitStatus("success");
      // 使ったら戻すをやっている箇所。
      formElement.reset();
      setSelectedDate(null);
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    // 処理が成功か否かに関わらず最後に実行する命令を書く場所。
    } finally {
      // 処理が終わったら状態をfalseにする必要がある。
      // これをしないと一度送信ボタンを押したら二度と押せなくなるから。
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h2>Request Details</h2>

      <form className={styles.bookingForm} onSubmit={handleSubmit}>
        <div className={styles.formField}>
          <label className={styles.label} htmlFor="preferredDate">Preferred date</label>
          <div className={styles.calendarPanel}>
            <DayPicker
              id="preferredDate"
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              timeZone="Asia/Tokyo"
              showOutsideDays
            />
          </div>
          <input
            type="hidden"
            name="preferredDate"
            value={selectedDate ? formatDateKey(selectedDate) : ""}
          />
          <p className={styles.timezoneNote}>
            All dates and times are based on Kyoto local time (JST).
          </p>
        </div>

        <label className={styles.label} htmlFor="preferredTime">
          Preferred time
          <select id="preferredTime" name="preferredTime" defaultValue="">
            <option value="" disabled>
              select a time
            </option>
            {timeSlots.map((time) => (
              <option value={time} key={time}>
                {time}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label} htmlFor="numberOfGuests">
          Number of guests
          <input
            id="numberOfGuests"
            type="number"
            name="guestCount"
            min={experience.pricing.minGuests}
            max={experience.pricing.maxGuests}
          />
        </label>
        <label className={styles.label} htmlFor="name">
          Your name
          <input id="name" type="text" name="name" />
        </label>
        <label className={styles.label} htmlFor="email">
          Email
          <input id="email" type="email" name="email" />
        </label>
        <label className={styles.label} htmlFor="message">
          Message
          <textarea id="message" name="message" rows="5" />
        </label>

        <button
          className="btn btn--regular"
          type="submit"
          // 送信中はtrueのステートが来る、
          // だからこの属性によってボタンを押せない状態になる。
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Request"}
        </button>

        {submitStatus === "success" && (
          <p className={styles.successMessage}>
            Your booking request has been sent.
          </p>
        )}

        {submitStatus === "error" && (
          <p className={styles.errorMessage}>Failed to send booking request.</p>
        )}
      </form>
    </>
  );
}