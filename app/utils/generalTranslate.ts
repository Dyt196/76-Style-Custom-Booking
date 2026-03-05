export function countingStar(markStar: number, rate: number): string {
  let remaining = rate - markStar;
  if (remaining >= 0) {
    return "ic:round-star-rate";
  } else if (remaining < 0 && remaining > -1) {
    return "ic:round-star-half";
  }
  return "ic:round-star-outline";
}