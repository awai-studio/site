// @/components/analytics/UtmTracker/index.jsx

"use client";

import { useEffect } from "react";

const UTM_STORAGE_KEY = "awai_studio_utm";

// 現在のURLに付いているUTMをsessionStorageへ保存する。
function storeCurrentUtmTracking() {
  const params = new URLSearchParams(window.location.search);

  const trackingData = {
    tracking_utm_source: params.get("utm_source") || "",
    tracking_utm_medium: params.get("utm_medium") || "",
    tracking_utm_campaign: params.get("utm_campaign") || "",
    tracking_utm_content: params.get("utm_content") || "",
    tracking_utm_clicked_url: window.location.href,
  };

  const hasUtm =
    trackingData.tracking_utm_source ||
    trackingData.tracking_utm_medium ||
    trackingData.tracking_utm_campaign ||
    trackingData.tracking_utm_content;

  if (!hasUtm) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      UTM_STORAGE_KEY,
      JSON.stringify(trackingData)
    );
  } catch {
    // sessionStorageが利用できない場合は存在しない。
  }
}

// 予約送信時に、現在のURLまたは保存済みUTMを返す。
export function getUtmTrackingData() {
  const params = new URLSearchParams(window.location.search);

  let storedTrackingData = {};

  try {
    const savedTrackingData = JSON.parse(
      window.sessionStorage.getItem(UTM_STORAGE_KEY) || "{}"
    );

    if (savedTrackingData && typeof savedTrackingData === "object") {
      storedTrackingData = savedTrackingData;
    }
  } catch {
    // 保存済みデータを読めない場合は、現在のURLを使用する。
  }

  const currentUtmSource = params.get("utm_source") || "";
  const currentUtmMedium = params.get("utm_medium") || "";
  const currentUtmCampaign = params.get("utm_campaign") || "";
  const currentUtmContent = params.get("utm_content") || "";
  
  const hasCurrentUtm =
    currentUtmSource ||
    currentUtmMedium ||
    currentUtmCampaign ||
    currentUtmContent;
  
  return {
    trackingUtmSource:
      currentUtmSource || storedTrackingData.tracking_utm_source || "",
    trackingUtmMedium:
      currentUtmMedium || storedTrackingData.tracking_utm_medium || "",
    trackingUtmCampaign:
      currentUtmCampaign || storedTrackingData.tracking_utm_campaign || "",
    trackingUtmContent:
      currentUtmContent || storedTrackingData.tracking_utm_content || "",
    trackingUtmClickedUrl:
      hasCurrentUtm
        ? window.location.href
        : storedTrackingData.tracking_utm_clicked_url || window.location.href
  };
}

export default function UtmTracker() {
  useEffect(() => {
    storeCurrentUtmTracking();
  }, []);

  return null;
}