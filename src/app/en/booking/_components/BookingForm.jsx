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
  const [selectedDates, setSelectedDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formError, setFormError] = useState("");

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
  // 催行最大人数から配列を作る
  // const guestCounts = [...Array(experience.pricing.maxGuests).keys()].map((i) => i + 1);
  
  const maxGuestsNum = experience.pricing.maxGuests;
  const minGuestsNum = experience.pricing.minGuests;
  const guestsLength = maxGuestsNum - minGuestsNum + 1;
  const guestCounts = Array.from({ length: guestsLength }, (_, idx) => {
    return minGuestsNum + idx;
  })
  const preferenceLabels = [
    "Preferred date",
    "First alternative date",
    "Second alternative date",
  ];
  // フォームに入力している日付を取得
  const today = startOfDay(new Date());
  // 今日から10日後以降を予約可能にするため、その基準日を取得。
  const minSelectableDate = startOfDay(addDays(today, 10));
  // 今日の日付から90日間予約受付を行う、その基準日を取得。
  const maxSelectableDate = startOfDay(addDays(today, 90));
  // カレンダーに月めくりに必要な現在の時点からの月のデータ
  const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endMonth = new Date(
    maxSelectableDate.getFullYear(),
    maxSelectableDate.getMonth(),
    1
  );
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
      // 前回のエラー表示を初期化する。
      setFormError("");
      // FormDataクラスは、ブラウザが持っている Web API のクラス。
      // つまり、ブラウザが提供している機能を使ってインスタンスを作っている。
      const formData = new FormData(formElement);
      // バリデーションのための変数定義
      const customerName = formData.get("name");
      const customerEmail = formData.get("email");
      const guestCount = formData.get("guestCount");
      const preferredDate1 = formData.get("preferredDate1");
      const preferredTime1 = formData.get("preferredTime1");
      const preferredDate2 = formData.get("preferredDate2");
      const preferredTime2 = formData.get("preferredTime2");
      const preferredDate3 = formData.get("preferredDate3");
      const preferredTime3 = formData.get("preferredTime3");

      if (!preferredDate1) {
        setSubmitStatus(null);
        setFormError("Please choose at least one preferred date.");
        setIsSubmitting(false);
        return;
      }
      if (!preferredTime1) {
        setSubmitStatus(null);
        setFormError("Please select a time for your preferred date.");
        setIsSubmitting(false);
        return;
      }
      if (preferredDate2 && !preferredTime2) {
        setSubmitStatus(null);
        setFormError("Please select a time for your first alternative date.");
        setIsSubmitting(false);
        return;
      }
      if (preferredDate3 && !preferredTime3) {
        setSubmitStatus(null);
        setFormError("Please select a time for your second alternative date.");
        setIsSubmitting(false);
        return;
      }
      if (!guestCount) {
        setSubmitStatus(null);
        setFormError("Please select the number of guests.");
        setIsSubmitting(false);
        return;
      }
      if (!customerName) {
        setSubmitStatus(null);
        setFormError("Please enter your name.");
        setIsSubmitting(false);
        return;
      }
      if (!customerEmail) {
        setSubmitStatus(null);
        setFormError("Please enter your email address.");
        setIsSubmitting(false);
        return;
      }
      // 簡易的なEmailのバリデーション
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = emailPattern.test(customerEmail);
      if (!isEmailValid) {
        setSubmitStatus(null);
        setFormError("Please enter a valid email address.")
        setIsSubmitting(false);
        return;
      }

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
          customerName: customerName,
          customerEmail: customerEmail,
          guestCount: Number(guestCount),
          preferredDate1: preferredDate1,
          preferredTime1: preferredTime1,
          preferredDate2: preferredDate2,
          preferredTime2: preferredTime2,
          preferredDate3: preferredDate3,
          preferredTime3: preferredTime3,
          message: formData.get("message"),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send booking request.")
      }

      setSubmitStatus("success");
      setFormError("");
      // 使ったら戻すをやっている箇所。
      formElement.reset();
      setSelectedDates([]);
    } catch (error) {
      console.error(error);
      setFormError("");
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
          <label className={styles.label} htmlFor="preferredDate">
            Preferred date
          </label>
          <div className={styles.calendarPanel}>
            <DayPicker
              id="preferredDate"
              mode="multiple"
              max={3}
              selected={selectedDates}
              onSelect={setSelectedDates}
              disabled={isDateDisabled}
              timeZone="Asia/Tokyo"
              showOutsideDays
              captionLayout="label"
              startMonth={startMonth}
              endMonth={endMonth}
            />
          </div>
          <ul className={`explanation ${styles.daySelectNote}`}>
            <li className={styles.noteList}>
              Please select your preferred date first. You may also choose up to
              two alternative dates.
            </li>
            <li className={styles.noteList}>
              Booking requests must be submitted at least 10 days before your preferred date.
            </li>
            <li className={styles.noteList}>
              All dates and times are based on Kyoto local time (JST).
            </li>
          </ul>
        </div>

        <div className={styles.label}>
          <span className={styles.itemName}>Select preferred dates</span>
          {selectedDates.length === 0 ? (
            <div className={styles.dayZero}>
              Please choose at least one preferred date.
            </div>
          ) : (
            <div className={styles.datePreferences}>
              {selectedDates.map((date, idx) => (
                <div
                  className={styles.preferenceItem}
                  key={formatDateKey(date)}
                >
                  <input
                    type="hidden"
                    name={`preferredDate${idx + 1}`}
                    value={formatDateKey(date)}
                  />
                  <p className={styles.preferenceDate}>
                    {`${idx + 1}. ${preferenceLabels[idx]}: ${formatDateKey(date)}`}
                  </p>
                  <label
                    htmlFor={`preferred-time${idx + 1}`}
                    className={styles.preferenceTimeLabel}
                  >
                    <div>Preferred time</div>
                    <select
                      id={`preferred-time${idx + 1}`}
                      name={`preferredTime${idx + 1}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a time
                      </option>
                      {timeSlots.map((time) => (
                        <option value={time} key={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className={styles.label} htmlFor="numberOfGuests">
          <span className={styles.itemName}>Number of guests</span>
          <select name="guestCount" id="numberOfGuests" defaultValue="">
            <option value="" disabled>
              Select guests
            </option>
            {guestCounts.map((count) => (
              <option value={count} key={count}>
                {count === 1 ? `${count} person` : `${count} persons`}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label} htmlFor="name">
          <span className={styles.itemName}>Your name</span>
          <input id="name" type="text" name="name" />
        </label>
        <label className={styles.label} htmlFor="email">
          <span className={styles.itemName}>Email</span>
          <input id="email" type="text" name="email" />
        </label>
        <label className={styles.label} htmlFor="message">
          <span className={styles.itemName}>Message</span>
          <textarea id="message" name="message" rows="5" />
        </label>

        {
          formError && 
            <div className={styles.formErrorMessage}>
              <p>{formError}</p>
            </div>
        }

        <div className="cta">
          <button
            className={`btn btn--regular ${styles.bookingFormInlineCta}`}
            type="submit"
            // 送信中はtrueのステートが来る、
            // だからこの属性によってボタンを押せない状態になる。
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Request"}
          </button>
        </div>

        {submitStatus === "success" && (
          <div className={styles.successMessage}>
            <p>Your booking request has been sent.</p>
            <p>We will check availability and contact you by email.</p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className={styles.errorMessage}>
            <p>Failed to send booking request.</p>
            <p>Please try again later or contact us by email.</p>
          </div>
        )}
      </form>
    </>
  );
}