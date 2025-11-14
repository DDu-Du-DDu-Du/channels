const daysInKorean = ["일", "월", "화", "수", "목", "금", "토"];

function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    throw new Error("유효하지 않은 날짜 형식입니다.");
  }

  return daysInKorean[date.getDay()];
}

export default getDayOfWeek;
