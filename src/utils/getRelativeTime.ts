export const getRelativeTime = (date: string): string => {
  const d = Date.parse(date);
  const n = Date.now();
  const t = n - d;
  if (t < 0) {
    return "未来";
  } else if (t / (365 * 24 * 60 * 60 * 1000) > 1) {
    return (t / (365 * 24 * 60 * 60 * 1000)).toFixed() + "年";
  } else if (t / (24 * 60 * 60 * 1000) > 1) {
    return (t / (24 * 60 * 60 * 1000)).toFixed() + "日";
  } else if (t / (60 * 60 * 1000) > 1) {
    return (t / (60 * 60 * 1000)).toFixed() + "時間";
  } else if (t / (60 * 1000) > 1) {
    return (t / (60 * 1000)).toFixed() + "分";
  } else {
    return (t / 1000).toFixed() + "秒";
  }
};
