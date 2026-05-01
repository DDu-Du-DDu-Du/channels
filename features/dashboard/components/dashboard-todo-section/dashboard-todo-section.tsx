import { View } from "react-native";

import { SpoqaText } from "@/components";
import type { TodoDashboardContentType } from "@/types/response/todo/todo";
import { formatDateToYYYYMMDD } from "@/utils";

import DashboardTodoItem from "../dashboard-todo-item/dashboard-todo-item";

interface DashboardTodoSectionProps {
  section: TodoDashboardContentType;
  onCompleteToggle: (id: number) => void;
  onOpenMenu: (id: number) => void;
}

const MONTH_LABELS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const parseDate = (date: string) => new Date(`${date}T00:00:00`);

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const formatSectionTitle = (date: string) => {
  const parsedDate = parseDate(date);
  const today = new Date();
  const todayString = formatDateToYYYYMMDD(today);
  const tomorrowString = formatDateToYYYYMMDD(addDays(today, 1));
  const month = MONTH_LABELS[parsedDate.getMonth()] ?? "";
  const day = parsedDate.getDate();
  const dayOfWeek = DAY_LABELS[parsedDate.getDay()] ?? "";
  const dateLabel = `${month} ${day} (${dayOfWeek})`;

  if (date === todayString) {
    return `TODAY, ${dateLabel}`;
  }

  if (date === tomorrowString) {
    return `TOMORROW, ${dateLabel}`;
  }

  return dateLabel;
};

function DashboardTodoSection({
  section,
  onCompleteToggle,
  onOpenMenu,
}: DashboardTodoSectionProps) {
  return (
    <View className="mb-[2rem]">
      <SpoqaText
        weight="bold"
        className="mb-[1.6rem] text-size14 text-role-text-tertiary dark:text-role-dark-text-tertiary"
      >
        {formatSectionTitle(section.date)}
      </SpoqaText>
      {section.todos.map((todo) => (
        <DashboardTodoItem
          key={todo.id}
          item={todo}
          onCompleteToggle={onCompleteToggle}
          onOpenMenu={onOpenMenu}
        />
      ))}
    </View>
  );
}

export default DashboardTodoSection;
