// @/lib/article/imageValidation.js

// 画像アップロードの検査部品

// 1KB = 1024バイト
// 1MB = 1024KB
export const ARTICLE_IMAGE_LIMITS = {
  size: 1.5 * 1024 * 1024,
  filename: 100,
  altText: 100,
};

const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F]/u;

const IMAGE_TYPES = {
  "image/jpeg": {
    extension: "jpg",
    filenamePattern: /\.(?:jpg|jpeg)$/i,

    matches(bytes) {
      return (
        bytes[0] === 0xff &&
        bytes[1] === 0xd8 &&
        bytes[2] === 0xff
      );
    },
  },

  "image/png": {
    extension: "png",
    filenamePattern: /\.png$/i,

    matches(bytes) {
      const signature = [
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a,
      ];

      return signature.every(
        (value, index) => bytes[index] === value,
      );
    },
  },

  "image/webp": {
    extension: "webp",
    filenamePattern: /\.webp$/i,

    matches(bytes) {
      return (
        String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
        String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
      );
    },
  },
};

function invalid(message) {
  return {
    isValid: false,
    error: message,
  };
}

export async function validateArticleImage(file) {
  if (!(file instanceof File) || file.size === 0) {
    return invalid("写真を選択してください。");
  }

  if (
    !file.name ||
    file.name.length > ARTICLE_IMAGE_LIMITS.filename
  ) {
    return invalid("写真のファイル名が長すぎます。");
  }

  if (CONTROL_CHARACTER_PATTERN.test(file.name)) {
    return invalid(
      "写真のファイル名に使用できない文字が含まれています。",
    );
  }

  if (file.size > ARTICLE_IMAGE_LIMITS.size) {
    return invalid("写真は1.5MB以内に調整してください。");
  }

  const imageType = IMAGE_TYPES[file.type];

  if (
    !imageType ||
    !imageType.filenamePattern.test(file.name)
  ) {
    return invalid(
      "写真はJPEG、PNG、WebP形式で選択してください。",
    );
  }

  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (
      bytes.length < 12 ||
      !imageType.matches(bytes)
    ) {
      return invalid("正しい画像ファイルを選択してください。");
    }
  } catch {
    return invalid("写真の内容を確認できませんでした。");
  }

  return {
    isValid: true,
    error: null,
    extension: imageType.extension,
    mimeType: file.type,
  };
}