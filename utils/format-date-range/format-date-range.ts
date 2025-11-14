const formatDateRange = (startDate: string, endDate: string): string => {
  const isoStartDate = new Date(startDate).toISOString().split("T")[0];
  const isoEndDate = new Date(endDate).toISOString().split("T")[0];

  if (new Date(isoEndDate) < new Date(isoStartDate)) {
    throw new Error("종료 날짜가 시작 날짜보다 이전입니다.");
  }

  if (isoStartDate === isoEndDate) {
    return isoStartDate.replace(/-/g, ".");
  }

  return `${isoStartDate.replace(/-/g, ".")} ~ ${isoEndDate.replace(/-/g, ".")}`;
};

export default formatDateRange;
