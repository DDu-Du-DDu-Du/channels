const convertCurrentDate = (type: "next" | "prev", yearMonth: string) => {
  const yearMonthDate = new Date(yearMonth);

  yearMonthDate.setMonth(
    type === "next" ? yearMonthDate.getMonth() - 1 : yearMonthDate.getMonth() + 1,
  );

  return yearMonthDate.toJSON().substring(0, 10);
};

export default convertCurrentDate;
