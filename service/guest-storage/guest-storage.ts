import { normalizeDayOfWeekToEn } from "@/constants";
import type { RequestTodo } from "@/types/request/feed/feed";
import type {
  GoalEditRequestType,
  GoalRequestType,
  GoalTerminateRequestType,
} from "@/types/request/goal/goal";
import type {
  RepeatDayOfWeek,
  RepeatTodoCreateRequestType,
  RepeatTodoRequestType,
} from "@/types/request/repeat-todo/repeat-todo";
import type {
  MainDailyListType,
  MainDailyTimeTableType,
  MainTimeTableTodoType,
  MonthlyWeeklyTodoType,
} from "@/types/response/feed/feed";
import type { GoalDetailType, GoalType } from "@/types/response/goal/goal";
import type {
  ReminderIdResponseType,
  RetrieveReminderResponseType,
} from "@/types/response/reminder/reminder";
import type { DayOfWeek, RepeatTodosType } from "@/types/response/repeat-todo/repeat-todo";
import type { TodosearchResponseType } from "@/types/response/todo/todo";

import * as SQLite from "expo-sqlite";

const GUEST_DATABASE_NAME = "guest-mode.db";
const GUEST_USER_ID = 0;
const GUEST_DATABASE_VERSION = 1;

const DEFAULT_GOAL_NAME = "기본 목표";
const DEFAULT_TODO_NAME = "게스트 투두를 시작해보세요";

let guestDatabasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

interface GoalRow {
  id: number;
  name: string;
  color: string;
  privacyType: "PUBLIC" | "FOLLOWER" | "PRIVATE";
  status: "IN_PROGRESS" | "DONE";
  priority: number;
}

interface TodoRow {
  id: number;
  goalId: number;
  name: string;
  status: "UNCOMPLETED" | "COMPLETE";
  scheduledOn: string;
  beginAt: string | null;
  endAt: string | null;
  postponedAt: string | null;
  memo: string | null;
  repeatTodoId: number | null;
}

interface RepeatTodoRow {
  id: number;
  goalId: number;
  name: string;
  repeatType: "DAILY" | "WEEKLY" | "MONTHLY";
  repeatDaysOfWeek: string | null;
  repeatDaysOfMonth: string | null;
  lastDayOfMonth: number;
  startDate: string;
  endDate: string;
  beginAt: string | null;
  endAt: string | null;
}

interface ReminderRow {
  id: number;
  remindsAt: string;
  remindedAt: string | null;
}

interface RepeatTodoMaterializeInput {
  goalId: number;
  repeatTodoId: number;
  name: string;
  repeatType: "DAILY" | "WEEKLY" | "MONTHLY";
  repeatDaysOfWeek?: RepeatDayOfWeek[];
  repeatDaysOfMonth?: number[];
  lastDayOfMonth?: boolean;
  startDate: string;
  endDate: string;
  beginAt?: string | null;
  endAt?: string | null;
}

const handlePad2 = (value: number) => String(value).padStart(2, "0");

const handleFormatLocalDate = (date: Date) =>
  `${date.getFullYear()}-${handlePad2(date.getMonth() + 1)}-${handlePad2(date.getDate())}`;

const handleParseLocalDate = (value: string) => new Date(`${value}T00:00:00`);

const handleNormalizeColor = (color: string) => color.replace(/^#/, "").toUpperCase();

const handleParseJsonArray = <T>(value: string | null): T[] | undefined => {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed as T[];
    }
  } catch {
    return undefined;
  }

  return undefined;
};

const handleNormalizeRepeatDaysOfWeek = (days?: RepeatDayOfWeek[]) => {
  if (!days || days.length === 0) {
    return null;
  }

  return JSON.stringify(days.map((day) => normalizeDayOfWeekToEn(day)));
};

const handleNormalizeRepeatDaysOfMonth = (days?: number[]) => {
  if (!days || days.length === 0) {
    return null;
  }

  return JSON.stringify(days);
};

const WEEK_DAY_TO_JS_DAY: Record<DayOfWeek, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
};

const handleNormalizeRepeatDaysToJsDaySet = (days?: RepeatDayOfWeek[]) => {
  if (!days?.length) {
    return new Set<number>();
  }

  return new Set(
    days.map((day) => normalizeDayOfWeekToEn(day)).map((day) => WEEK_DAY_TO_JS_DAY[day]),
  );
};

const handleGetTodayDate = () => handleFormatLocalDate(new Date());

const handleGetMaxDate = (left: string, right: string) => (left > right ? left : right);

const handleResolveRepeatDates = (
  repeatTodo: Pick<
    RepeatTodoMaterializeInput,
    | "repeatType"
    | "repeatDaysOfWeek"
    | "repeatDaysOfMonth"
    | "lastDayOfMonth"
    | "startDate"
    | "endDate"
  >,
  fromDate?: string,
) => {
  const effectiveStartDate = fromDate
    ? handleGetMaxDate(repeatTodo.startDate, fromDate)
    : repeatTodo.startDate;
  const startDate = handleParseLocalDate(effectiveStartDate);
  const endDate = handleParseLocalDate(repeatTodo.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate > endDate) {
    return [] as string[];
  }

  const weeklyJsDaySet = handleNormalizeRepeatDaysToJsDaySet(repeatTodo.repeatDaysOfWeek);
  const monthlyDaySet = new Set<number>(repeatTodo.repeatDaysOfMonth ?? []);
  const shouldIncludeMonthlyLastDay = Boolean(repeatTodo.lastDayOfMonth);
  const resolvedDates: string[] = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const jsDay = cursor.getDay();
    const dayOfMonth = cursor.getDate();
    const monthLastDate = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    let isIncluded = false;

    if (repeatTodo.repeatType === "DAILY") {
      isIncluded = true;
    } else if (repeatTodo.repeatType === "WEEKLY") {
      isIncluded = weeklyJsDaySet.has(jsDay);
    } else {
      isIncluded =
        monthlyDaySet.has(dayOfMonth) ||
        (shouldIncludeMonthlyLastDay && dayOfMonth === monthLastDate);
    }

    if (isIncluded) {
      resolvedDates.push(handleFormatLocalDate(cursor));
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return resolvedDates;
};

const handleInsertRepeatTodoInstances = async (
  database: SQLite.SQLiteDatabase,
  repeatTodo: RepeatTodoMaterializeInput,
  fromDate?: string,
) => {
  const scheduledDates = handleResolveRepeatDates(repeatTodo, fromDate);

  for (const scheduledOn of scheduledDates) {
    await database.runAsync(
      `
        INSERT INTO todos (
          user_id,
          goal_id,
          name,
          status,
          scheduled_on,
          begin_at,
          end_at,
          memo,
          repeat_todo_id
        )
        SELECT ?, ?, ?, 'UNCOMPLETED', ?, ?, ?, NULL, ?
        WHERE NOT EXISTS (
          SELECT 1
          FROM todos
          WHERE user_id = ? AND repeat_todo_id = ? AND scheduled_on = ?
        )
      `,
      GUEST_USER_ID,
      repeatTodo.goalId,
      repeatTodo.name,
      scheduledOn,
      repeatTodo.beginAt ?? null,
      repeatTodo.endAt ?? null,
      repeatTodo.repeatTodoId,
      GUEST_USER_ID,
      repeatTodo.repeatTodoId,
      scheduledOn,
    );
  }
};

const handleDeleteFutureRepeatTodoInstances = async (
  database: SQLite.SQLiteDatabase,
  repeatTodoId: number,
  fromDate: string = handleGetTodayDate(),
) => {
  await database.runAsync(
    `
      DELETE FROM todos
      WHERE user_id = ? AND repeat_todo_id = ? AND scheduled_on >= ?
    `,
    GUEST_USER_ID,
    repeatTodoId,
    fromDate,
  );
};

const handleMapRepeatTodoRowToResponse = (row: RepeatTodoRow): RepeatTodosType => {
  const repeatDaysOfWeek = handleParseJsonArray<DayOfWeek>(row.repeatDaysOfWeek);
  const repeatDaysOfMonth = handleParseJsonArray<number>(row.repeatDaysOfMonth);
  const lastDay = Boolean(row.lastDayOfMonth);

  return {
    id: row.id,
    name: row.name,
    repeatPattern: {
      repeatType: row.repeatType,
      repeatDaysOfWeek,
      repeatDaysOfMonth: repeatDaysOfMonth as RepeatTodosType["repeatPattern"]["repeatDaysOfMonth"],
      lastDay,
      info: {
        repeatType: row.repeatType,
        repeatDaysOfWeek,
        repeatDaysOfMonth,
        lastDayOfMonth: lastDay,
      },
    },
    startDate: row.startDate,
    endDate: row.endDate,
    beginAt: row.beginAt ?? undefined,
    endAt: row.endAt ?? undefined,
  };
};

const handleMapTodoStatus = (status: "UNCOMPLETED" | "COMPLETE") => status;

const handleGetGuestDatabase = async () => {
  if (!guestDatabasePromise) {
    guestDatabasePromise = (async () => {
      const database = await SQLite.openDatabaseAsync(GUEST_DATABASE_NAME);
      await database.execAsync("PRAGMA foreign_keys = ON;");
      await database.execAsync("PRAGMA journal_mode = WAL;");

      await handleMigrateGuestDatabase(database);
      await handleSeedGuestDatabase(database);

      return database;
    })();
  }

  return guestDatabasePromise;
};

const handleMigrateGuestDatabase = async (database: SQLite.SQLiteDatabase) => {
  const versionRow = await database.getFirstAsync<{ user_version: number }>("PRAGMA user_version;");
  const currentVersion = versionRow?.user_version ?? 0;

  if (currentVersion >= GUEST_DATABASE_VERSION) {
    return;
  }

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '191919',
      privacy_type TEXT NOT NULL DEFAULT 'PRIVATE',
      status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
      priority INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS repeat_todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      repeat_type TEXT NOT NULL,
      repeat_days_of_week TEXT,
      repeat_days_of_month TEXT,
      last_day_of_month INTEGER NOT NULL DEFAULT 0,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      begin_at TEXT,
      end_at TEXT,
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      goal_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'UNCOMPLETED',
      scheduled_on TEXT NOT NULL,
      begin_at TEXT,
      end_at TEXT,
      postponed_at TEXT,
      memo TEXT,
      repeat_todo_id INTEGER,
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
      FOREIGN KEY (repeat_todo_id) REFERENCES repeat_todos(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS todo_reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      todo_id INTEGER NOT NULL,
      reminds_at TEXT NOT NULL,
      reminded_at TEXT,
      FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_goals_user_priority ON goals(user_id, priority, id);
    CREATE INDEX IF NOT EXISTS idx_todos_user_date ON todos(user_id, scheduled_on, goal_id);
    CREATE INDEX IF NOT EXISTS idx_todos_goal ON todos(goal_id);
    CREATE INDEX IF NOT EXISTS idx_todos_name ON todos(name);
    CREATE INDEX IF NOT EXISTS idx_todos_begin_at ON todos(scheduled_on, begin_at);
    CREATE INDEX IF NOT EXISTS idx_repeat_todos_goal ON repeat_todos(goal_id);
    CREATE INDEX IF NOT EXISTS idx_todo_reminders_todo ON todo_reminders(todo_id, reminds_at);
  `);

  await database.execAsync(`PRAGMA user_version = ${GUEST_DATABASE_VERSION};`);
};

const handleSeedGuestDatabase = async (database: SQLite.SQLiteDatabase) => {
  const countRow = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) AS count FROM goals WHERE user_id = ?",
    GUEST_USER_ID,
  );

  if ((countRow?.count ?? 0) > 0) {
    return;
  }

  const insertGoalResult = await database.runAsync(
    `
      INSERT INTO goals (user_id, name, color, privacy_type, status, priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    GUEST_USER_ID,
    DEFAULT_GOAL_NAME,
    "191919",
    "PRIVATE",
    "IN_PROGRESS",
    1,
  );

  const goalId = Number(insertGoalResult.lastInsertRowId);

  await database.runAsync(
    `
      INSERT INTO todos (user_id, goal_id, name, status, scheduled_on)
      VALUES (?, ?, ?, ?, ?)
    `,
    GUEST_USER_ID,
    goalId,
    DEFAULT_TODO_NAME,
    "UNCOMPLETED",
    handleFormatLocalDate(new Date()),
  );
};

const handleGetGoalListRows = async (): Promise<GoalRow[]> => {
  const database = await handleGetGuestDatabase();

  return database.getAllAsync<GoalRow>(
    `
      SELECT
        id,
        name,
        color,
        privacy_type AS privacyType,
        status,
        priority
      FROM goals
      WHERE user_id = ?
      ORDER BY priority ASC, id ASC
    `,
    GUEST_USER_ID,
  );
};

const handleGetTodoRowById = async (todoId: number): Promise<TodoRow | null> => {
  const database = await handleGetGuestDatabase();

  return database.getFirstAsync<TodoRow>(
    `
      SELECT
        id,
        goal_id AS goalId,
        name,
        status,
        scheduled_on AS scheduledOn,
        begin_at AS beginAt,
        end_at AS endAt,
        postponed_at AS postponedAt,
        memo,
        repeat_todo_id AS repeatTodoId
      FROM todos
      WHERE id = ? AND user_id = ?
    `,
    todoId,
    GUEST_USER_ID,
  );
};

const handleGetRepeatTodoRowById = async (repeatTodoId: number): Promise<RepeatTodoRow | null> => {
  const database = await handleGetGuestDatabase();

  return database.getFirstAsync<RepeatTodoRow>(
    `
      SELECT
        id,
        goal_id AS goalId,
        name,
        repeat_type AS repeatType,
        repeat_days_of_week AS repeatDaysOfWeek,
        repeat_days_of_month AS repeatDaysOfMonth,
        last_day_of_month AS lastDayOfMonth,
        start_date AS startDate,
        end_date AS endDate,
        begin_at AS beginAt,
        end_at AS endAt
      FROM repeat_todos
      WHERE id = ?
    `,
    repeatTodoId,
  );
};

const handleGetReminderRowsByTodoId = async (todoId: number): Promise<ReminderRow[]> => {
  const database = await handleGetGuestDatabase();

  return database.getAllAsync<ReminderRow>(
    `
      SELECT
        id,
        reminds_at AS remindsAt,
        reminded_at AS remindedAt
      FROM todo_reminders
      WHERE todo_id = ?
      ORDER BY reminds_at ASC, id ASC
    `,
    todoId,
  );
};

const handleSyncTodoReminders = async (
  database: SQLite.SQLiteDatabase,
  todoId: number,
  reminders?: {
    id?: number;
    remindsAt: string;
  }[],
) => {
  if (!reminders) {
    return;
  }

  await database.runAsync("DELETE FROM todo_reminders WHERE todo_id = ?", todoId);

  for (const reminder of reminders) {
    if (reminder.id) {
      await database.runAsync(
        `
          INSERT INTO todo_reminders (id, todo_id, reminds_at, reminded_at)
          VALUES (?, ?, ?, NULL)
        `,
        reminder.id,
        todoId,
        reminder.remindsAt,
      );
      continue;
    }

    await database.runAsync(
      `
        INSERT INTO todo_reminders (todo_id, reminds_at, reminded_at)
        VALUES (?, ?, NULL)
      `,
      todoId,
      reminder.remindsAt,
    );
  }
};

const handleResolvePeriodRange = (date: string, type: "WEEK" | "MONTH") => {
  const normalizedDate = date.length === 7 ? `${date}-01` : date;
  const parsedDate = handleParseLocalDate(normalizedDate);

  if (Number.isNaN(parsedDate.getTime())) {
    const now = new Date();
    return {
      fromDate: handleFormatLocalDate(now),
      toDate: handleFormatLocalDate(now),
    };
  }

  if (type === "MONTH") {
    const from = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
    const to = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0);

    return {
      fromDate: handleFormatLocalDate(from),
      toDate: handleFormatLocalDate(to),
    };
  }

  const from = new Date(parsedDate);
  from.setDate(parsedDate.getDate() - parsedDate.getDay());
  const to = new Date(from);
  to.setDate(from.getDate() + 6);

  return {
    fromDate: handleFormatLocalDate(from),
    toDate: handleFormatLocalDate(to),
  };
};

export const clearGuestLocalData = async () => {
  if (guestDatabasePromise) {
    try {
      const database = await guestDatabasePromise;
      await database.closeAsync();
    } catch {
      // noop
      console.error("[guest] failed to close local db");
    }
  }

  guestDatabasePromise = null;

  try {
    await SQLite.deleteDatabaseAsync(GUEST_DATABASE_NAME);
  } catch {
    // noop
    console.error("[guest] failed to close local db");
  }
};

export const hasGuestTodo = async (): Promise<boolean> => {
  const database = await handleGetGuestDatabase();
  const countRow = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) AS count FROM todos WHERE user_id = ?",
    GUEST_USER_ID,
  );

  return (countRow?.count ?? 0) > 0;
};

export const getGuestGoalList = async (): Promise<GoalType[]> => {
  const goalRows = await handleGetGoalListRows();

  return goalRows.map((goalRow) => ({
    id: goalRow.id,
    name: goalRow.name,
    status: goalRow.status,
    color: goalRow.color,
    priority: goalRow.priority,
  }));
};

export const createGuestGoal = async ({ requestGoal }: { requestGoal: GoalRequestType }) => {
  const database = await handleGetGuestDatabase();
  const maxPriorityRow = await database.getFirstAsync<{ maxPriority: number | null }>(
    "SELECT MAX(priority) AS maxPriority FROM goals WHERE user_id = ?",
    GUEST_USER_ID,
  );
  const nextPriority = (maxPriorityRow?.maxPriority ?? 0) + 1;

  const insertGoalResult = await database.runAsync(
    `
      INSERT INTO goals (user_id, name, color, privacy_type, status, priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    GUEST_USER_ID,
    requestGoal.name,
    handleNormalizeColor(requestGoal.color),
    requestGoal.privacyType,
    "IN_PROGRESS",
    nextPriority,
  );

  const goalId = Number(insertGoalResult.lastInsertRowId);

  for (const repeatTodo of requestGoal.repeatTodos ?? []) {
    const repeatTodoInsertResult = await database.runAsync(
      `
        INSERT INTO repeat_todos (
          goal_id,
          name,
          repeat_type,
          repeat_days_of_week,
          repeat_days_of_month,
          last_day_of_month,
          start_date,
          end_date,
          begin_at,
          end_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      goalId,
      repeatTodo.name,
      repeatTodo.repeatType,
      handleNormalizeRepeatDaysOfWeek(repeatTodo.repeatDaysOfWeek),
      handleNormalizeRepeatDaysOfMonth(repeatTodo.repeatDaysOfMonth),
      repeatTodo.lastDayOfMonth ? 1 : 0,
      repeatTodo.startDate,
      repeatTodo.endDate,
      repeatTodo.beginAt ?? null,
      repeatTodo.endAt ?? null,
    );

    await handleInsertRepeatTodoInstances(database, {
      goalId,
      repeatTodoId: Number(repeatTodoInsertResult.lastInsertRowId),
      name: repeatTodo.name,
      repeatType: repeatTodo.repeatType,
      repeatDaysOfWeek: repeatTodo.repeatDaysOfWeek,
      repeatDaysOfMonth: repeatTodo.repeatDaysOfMonth,
      lastDayOfMonth: repeatTodo.lastDayOfMonth,
      startDate: repeatTodo.startDate,
      endDate: repeatTodo.endDate,
      beginAt: repeatTodo.beginAt,
      endAt: repeatTodo.endAt,
    });
  }

  return { id: goalId };
};

export const getGuestGoalDetail = async ({
  goalId,
}: {
  goalId: number;
}): Promise<GoalDetailType> => {
  const database = await handleGetGuestDatabase();
  const goalRow = await database.getFirstAsync<GoalRow>(
    `
      SELECT
        id,
        name,
        color,
        privacy_type AS privacyType,
        status,
        priority
      FROM goals
      WHERE id = ? AND user_id = ?
    `,
    goalId,
    GUEST_USER_ID,
  );

  if (!goalRow) {
    throw new Error("Goal not found");
  }

  const repeatTodoRows = await database.getAllAsync<RepeatTodoRow>(
    `
      SELECT
        id,
        goal_id AS goalId,
        name,
        repeat_type AS repeatType,
        repeat_days_of_week AS repeatDaysOfWeek,
        repeat_days_of_month AS repeatDaysOfMonth,
        last_day_of_month AS lastDayOfMonth,
        start_date AS startDate,
        end_date AS endDate,
        begin_at AS beginAt,
        end_at AS endAt
      FROM repeat_todos
      WHERE goal_id = ?
      ORDER BY id ASC
    `,
    goalId,
  );

  return {
    id: goalRow.id,
    name: goalRow.name,
    status: goalRow.status,
    color: goalRow.color,
    privacyType: goalRow.privacyType,
    repeatTodos: repeatTodoRows.map(handleMapRepeatTodoRowToResponse),
  };
};

export const editGuestGoal = async ({
  goalId,
  requestGoal,
}: {
  goalId: number;
  requestGoal: GoalEditRequestType;
}) => {
  const database = await handleGetGuestDatabase();

  await database.runAsync(
    `
      UPDATE goals
      SET
        name = ?,
        color = ?,
        privacy_type = ?
      WHERE id = ? AND user_id = ?
    `,
    requestGoal.name,
    handleNormalizeColor(requestGoal.color),
    requestGoal.privacyType,
    goalId,
    GUEST_USER_ID,
  );

  return { id: goalId };
};

export const terminateGuestGoal = async ({
  goalId,
  requestGoal,
}: {
  goalId: number;
  requestGoal: GoalTerminateRequestType;
}) => {
  const database = await handleGetGuestDatabase();

  await database.runAsync(
    `
      UPDATE goals
      SET status = ?
      WHERE id = ? AND user_id = ?
    `,
    requestGoal.status,
    goalId,
    GUEST_USER_ID,
  );

  return { id: goalId };
};

export const deleteGuestGoal = async ({ goalId }: { goalId: number }) => {
  const database = await handleGetGuestDatabase();
  await database.runAsync("DELETE FROM goals WHERE id = ? AND user_id = ?", goalId, GUEST_USER_ID);

  return 204;
};

export const createGuestRepeatTodo = async ({
  requestRepeatTodo,
}: {
  requestRepeatTodo: RepeatTodoCreateRequestType;
}) => {
  const database = await handleGetGuestDatabase();
  const insertRepeatTodoResult = await database.runAsync(
    `
      INSERT INTO repeat_todos (
        goal_id,
        name,
        repeat_type,
        repeat_days_of_week,
        repeat_days_of_month,
        last_day_of_month,
        start_date,
        end_date,
        begin_at,
        end_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    requestRepeatTodo.goalId,
    requestRepeatTodo.name,
    requestRepeatTodo.repeatType,
    handleNormalizeRepeatDaysOfWeek(requestRepeatTodo.repeatDaysOfWeek),
    handleNormalizeRepeatDaysOfMonth(requestRepeatTodo.repeatDaysOfMonth),
    requestRepeatTodo.lastDayOfMonth ? 1 : 0,
    requestRepeatTodo.startDate,
    requestRepeatTodo.endDate,
    requestRepeatTodo.beginAt ?? null,
    requestRepeatTodo.endAt ?? null,
  );
  const repeatTodoId = Number(insertRepeatTodoResult.lastInsertRowId);

  await handleInsertRepeatTodoInstances(database, {
    goalId: requestRepeatTodo.goalId,
    repeatTodoId,
    name: requestRepeatTodo.name,
    repeatType: requestRepeatTodo.repeatType,
    repeatDaysOfWeek: requestRepeatTodo.repeatDaysOfWeek,
    repeatDaysOfMonth: requestRepeatTodo.repeatDaysOfMonth,
    lastDayOfMonth: requestRepeatTodo.lastDayOfMonth,
    startDate: requestRepeatTodo.startDate,
    endDate: requestRepeatTodo.endDate,
    beginAt: requestRepeatTodo.beginAt,
    endAt: requestRepeatTodo.endAt,
  });

  return { id: repeatTodoId };
};

export const editGuestRepeatTodo = async ({
  repeatTodoId,
  requestRepeatTodo,
}: {
  repeatTodoId: number;
  requestRepeatTodo: RepeatTodoRequestType;
}) => {
  const database = await handleGetGuestDatabase();
  const currentRepeatTodo = await handleGetRepeatTodoRowById(repeatTodoId);

  if (!currentRepeatTodo) {
    throw new Error("Repeat todo not found");
  }

  await database.runAsync(
    `
      UPDATE repeat_todos
      SET
        name = ?,
        repeat_type = ?,
        repeat_days_of_week = ?,
        repeat_days_of_month = ?,
        last_day_of_month = ?,
        start_date = ?,
        end_date = ?,
        begin_at = ?,
        end_at = ?
      WHERE id = ?
    `,
    requestRepeatTodo.name,
    requestRepeatTodo.repeatType,
    handleNormalizeRepeatDaysOfWeek(requestRepeatTodo.repeatDaysOfWeek),
    handleNormalizeRepeatDaysOfMonth(requestRepeatTodo.repeatDaysOfMonth),
    requestRepeatTodo.lastDayOfMonth ? 1 : 0,
    requestRepeatTodo.startDate,
    requestRepeatTodo.endDate,
    requestRepeatTodo.beginAt ?? null,
    requestRepeatTodo.endAt ?? null,
    repeatTodoId,
  );

  await handleDeleteFutureRepeatTodoInstances(database, repeatTodoId, handleGetTodayDate());
  await handleInsertRepeatTodoInstances(
    database,
    {
      goalId: currentRepeatTodo.goalId,
      repeatTodoId,
      name: requestRepeatTodo.name,
      repeatType: requestRepeatTodo.repeatType,
      repeatDaysOfWeek: requestRepeatTodo.repeatDaysOfWeek,
      repeatDaysOfMonth: requestRepeatTodo.repeatDaysOfMonth,
      lastDayOfMonth: requestRepeatTodo.lastDayOfMonth,
      startDate: requestRepeatTodo.startDate,
      endDate: requestRepeatTodo.endDate,
      beginAt: requestRepeatTodo.beginAt,
      endAt: requestRepeatTodo.endAt,
    },
    handleGetTodayDate(),
  );

  return { id: repeatTodoId };
};

export const deleteGuestRepeatTodo = async ({ repeatTodoId }: { repeatTodoId: number }) => {
  const database = await handleGetGuestDatabase();
  await handleDeleteFutureRepeatTodoInstances(database, repeatTodoId, handleGetTodayDate());
  await database.runAsync("DELETE FROM repeat_todos WHERE id = ?", repeatTodoId);

  return 204;
};

export const getGuestDailyList = async ({
  date,
}: {
  date: string;
}): Promise<MainDailyListType[]> => {
  const database = await handleGetGuestDatabase();
  const goalRows = await handleGetGoalListRows();
  const todoRows = await database.getAllAsync<Pick<TodoRow, "id" | "goalId" | "name" | "status">>(
    `
      SELECT
        id,
        goal_id AS goalId,
        name,
        status
      FROM todos
      WHERE user_id = ? AND scheduled_on = ?
      ORDER BY id DESC
    `,
    GUEST_USER_ID,
    date,
  );

  const todosByGoalId = new Map<number, MainDailyListType["todos"]>();

  for (const todoRow of todoRows) {
    const current = todosByGoalId.get(todoRow.goalId) ?? [];
    current.push({
      id: todoRow.id,
      name: todoRow.name,
      status: handleMapTodoStatus(todoRow.status),
    });
    todosByGoalId.set(todoRow.goalId, current);
  }

  return goalRows.map((goalRow) => ({
    goal: {
      id: goalRow.id,
      name: goalRow.name,
      color: goalRow.color,
      status: goalRow.status,
      priority: goalRow.priority,
    },
    todos: todosByGoalId.get(goalRow.id) ?? [],
  }));
};

export const getGuestDailyTimeTable = async ({
  date,
}: {
  date: string;
}): Promise<MainDailyTimeTableType> => {
  const database = await handleGetGuestDatabase();
  const timedRows = await database.getAllAsync<{
    id: number;
    name: string;
    status: "UNCOMPLETED" | "COMPLETE";
    goalId: number;
    beginAt: string;
    endAt: string | null;
    color: string;
  }>(
    `
      SELECT
        t.id,
        t.name,
        t.status,
        t.goal_id AS goalId,
        t.begin_at AS beginAt,
        t.end_at AS endAt,
        g.color
      FROM todos t
      JOIN goals g ON g.id = t.goal_id
      WHERE t.user_id = ? AND t.scheduled_on = ? AND t.begin_at IS NOT NULL
      ORDER BY t.begin_at ASC, t.id ASC
    `,
    GUEST_USER_ID,
    date,
  );

  const groupedByBeginAt = new Map<string, MainTimeTableTodoType[]>();

  for (const timedRow of timedRows) {
    const current = groupedByBeginAt.get(timedRow.beginAt) ?? [];
    current.push({
      id: timedRow.id,
      name: timedRow.name,
      status: handleMapTodoStatus(timedRow.status),
      goalId: timedRow.goalId,
      beginAt: timedRow.beginAt,
      endAt: timedRow.endAt ?? undefined,
      color: timedRow.color,
    });
    groupedByBeginAt.set(timedRow.beginAt, current);
  }

  const unassignedRows = await database.getAllAsync<{
    id: number;
    goalId: number;
    name: string;
    status: "UNCOMPLETED" | "COMPLETE";
  }>(
    `
      SELECT
        id,
        goal_id AS goalId,
        name,
        status
      FROM todos
      WHERE user_id = ? AND scheduled_on = ? AND begin_at IS NULL
      ORDER BY id DESC
    `,
    GUEST_USER_ID,
    date,
  );

  const goalRows = await handleGetGoalListRows();
  const unassignedByGoalId = new Map<number, MainDailyListType["todos"]>();

  for (const unassignedRow of unassignedRows) {
    const current = unassignedByGoalId.get(unassignedRow.goalId) ?? [];
    current.push({
      id: unassignedRow.id,
      name: unassignedRow.name,
      status: handleMapTodoStatus(unassignedRow.status),
    });
    unassignedByGoalId.set(unassignedRow.goalId, current);
  }

  return {
    timetable: [...groupedByBeginAt.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([beginAt, todos]) => ({
        beginAt,
        todos,
      })),
    unassignedTodos: goalRows
      .filter((goalRow) => (unassignedByGoalId.get(goalRow.id) ?? []).length > 0)
      .map((goalRow) => ({
        goal: {
          id: goalRow.id,
          name: goalRow.name,
          color: goalRow.color,
          status: goalRow.status,
          priority: goalRow.priority,
        },
        todos: unassignedByGoalId.get(goalRow.id) ?? [],
      })),
  };
};

export const getGuestPeriodTodos = async ({
  date,
  type,
}: {
  date: string;
  type: "WEEK" | "MONTH";
}): Promise<MonthlyWeeklyTodoType[]> => {
  const database = await handleGetGuestDatabase();
  const { fromDate, toDate } = handleResolvePeriodRange(date, type);

  const rows = await database.getAllAsync<{
    date: string;
    totalCount: number;
    completedCount: number;
    uncompletedCount: number;
  }>(
    `
      SELECT
        scheduled_on AS date,
        COUNT(*) AS totalCount,
        SUM(CASE WHEN status = 'COMPLETE' THEN 1 ELSE 0 END) AS completedCount,
        SUM(CASE WHEN status != 'COMPLETE' THEN 1 ELSE 0 END) AS uncompletedCount
      FROM todos
      WHERE user_id = ? AND scheduled_on BETWEEN ? AND ?
      GROUP BY scheduled_on
      ORDER BY scheduled_on ASC
    `,
    GUEST_USER_ID,
    fromDate,
    toDate,
  );

  return rows.map((row) => ({
    date: row.date,
    totalCount: Number(row.totalCount ?? 0),
    completedCount: Number(row.completedCount ?? 0),
    uncompletedCount: Number(row.uncompletedCount ?? 0),
  }));
};

export const getGuestTodoDetail = async ({ id }: { id: number }) => {
  const todoRow = await handleGetTodoRowById(id);

  if (!todoRow) {
    throw new Error("Todo not found");
  }

  const reminderRows = await handleGetReminderRowsByTodoId(id);

  return {
    id: todoRow.id,
    name: todoRow.name,
    memo: todoRow.memo ?? undefined,
    status: todoRow.status,
    goalId: todoRow.goalId,
    repeatTodoId: todoRow.repeatTodoId ?? undefined,
    scheduledOn: todoRow.scheduledOn,
    beginAt: todoRow.beginAt,
    endAt: todoRow.endAt,
    reminders: reminderRows,
  };
};

export const createGuestTodo = async ({ requestTodo }: { requestTodo: RequestTodo }) => {
  const database = await handleGetGuestDatabase();
  const insertTodoResult = await database.runAsync(
    `
      INSERT INTO todos (
        user_id,
        goal_id,
        name,
        status,
        scheduled_on,
        begin_at,
        end_at,
        memo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    GUEST_USER_ID,
    requestTodo.goalId,
    requestTodo.name,
    "UNCOMPLETED",
    requestTodo.scheduledOn,
    requestTodo.beginAt ?? null,
    requestTodo.endAt ?? null,
    requestTodo.memo ?? null,
  );

  const todoId = Number(insertTodoResult.lastInsertRowId);
  await handleSyncTodoReminders(database, todoId, requestTodo.reminders);

  return { id: todoId };
};

export const editGuestTodo = async ({
  id,
  requestTodo,
}: {
  id: number;
  requestTodo: RequestTodo;
}) => {
  const database = await handleGetGuestDatabase();
  const currentTodoRow = await handleGetTodoRowById(id);

  if (!currentTodoRow) {
    throw new Error("Todo not found");
  }

  await database.runAsync(
    `
      UPDATE todos
      SET
        goal_id = ?,
        name = ?,
        scheduled_on = ?,
        memo = ?,
        begin_at = ?,
        end_at = ?
      WHERE id = ? AND user_id = ?
    `,
    requestTodo.goalId,
    requestTodo.name,
    requestTodo.scheduledOn,
    requestTodo.memo ?? currentTodoRow.memo,
    requestTodo.beginAt ?? currentTodoRow.beginAt,
    requestTodo.endAt ?? currentTodoRow.endAt,
    id,
    GUEST_USER_ID,
  );

  await handleSyncTodoReminders(database, id, requestTodo.reminders);

  return { id };
};

export const deleteGuestTodo = async ({ id }: { id: number }) => {
  const database = await handleGetGuestDatabase();
  await database.runAsync("DELETE FROM todos WHERE id = ? AND user_id = ?", id, GUEST_USER_ID);

  return 204;
};

export const toggleGuestTodoCompletion = async ({ id }: { id: number }) => {
  const database = await handleGetGuestDatabase();
  const currentTodoRow = await handleGetTodoRowById(id);

  if (!currentTodoRow) {
    throw new Error("Todo not found");
  }

  const nextStatus = currentTodoRow.status === "COMPLETE" ? "UNCOMPLETED" : "COMPLETE";

  await database.runAsync(
    "UPDATE todos SET status = ? WHERE id = ? AND user_id = ?",
    nextStatus,
    id,
    GUEST_USER_ID,
  );
};

export const changeGuestTodoDate = async ({ id, date }: { id: number; date: string }) => {
  const database = await handleGetGuestDatabase();

  await database.runAsync(
    `
      UPDATE todos
      SET
        scheduled_on = ?,
        postponed_at = ?
      WHERE id = ? AND user_id = ?
    `,
    date,
    new Date().toISOString(),
    id,
    GUEST_USER_ID,
  );

  return 204;
};

export const repeatGuestTodoDate = async ({ id, date }: { id: number; date: string }) => {
  const database = await handleGetGuestDatabase();
  const currentTodoRow = await handleGetTodoRowById(id);

  if (!currentTodoRow) {
    throw new Error("Todo not found");
  }

  const insertTodoResult = await database.runAsync(
    `
      INSERT INTO todos (
        user_id,
        goal_id,
        name,
        status,
        scheduled_on,
        begin_at,
        end_at,
        memo,
        repeat_todo_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    GUEST_USER_ID,
    currentTodoRow.goalId,
    currentTodoRow.name,
    "UNCOMPLETED",
    date,
    currentTodoRow.beginAt,
    currentTodoRow.endAt,
    currentTodoRow.memo,
    currentTodoRow.repeatTodoId,
  );

  return { id: Number(insertTodoResult.lastInsertRowId) };
};

export const changeGuestTodoTime = async ({
  id,
  time,
}: {
  id: number;
  time: { beginAt: string | null; endAt: string | null };
}) => {
  const database = await handleGetGuestDatabase();

  await database.runAsync(
    `
      UPDATE todos
      SET
        begin_at = ?,
        end_at = ?
      WHERE id = ? AND user_id = ?
    `,
    time.beginAt,
    time.endAt,
    id,
    GUEST_USER_ID,
  );

  return 204;
};

export const searchGuestTodos = async ({
  query,
  size,
  cursor,
}: {
  query: string;
  size: number;
  cursor: string | null;
}): Promise<TodosearchResponseType> => {
  const database = await handleGetGuestDatabase();
  const safeQuery = `%${query.replace(/[\\%_]/g, "\\$&")}%`;

  const parsedCursor = cursor ? Number(cursor) : null;
  const hasCursor = Number.isFinite(parsedCursor) && parsedCursor !== null;

  const rows = await database.getAllAsync<{
    id: number;
    name: string;
    scheduledOn: string;
    status: "COMPLETE" | "UNCOMPLETED";
  }>(
    `
      SELECT
        id,
        name,
        scheduled_on AS scheduledOn,
        status
      FROM todos
      WHERE
        user_id = ?
        AND name LIKE ? ESCAPE '\\'
        ${hasCursor ? "AND id < ?" : ""}
      ORDER BY id DESC
      LIMIT ?
    `,
    ...(hasCursor
      ? [GUEST_USER_ID, safeQuery, parsedCursor!, size + 1]
      : [GUEST_USER_ID, safeQuery, size + 1]),
  );

  const hasNext = rows.length > size;
  const slicedRows = hasNext ? rows.slice(0, size) : rows;
  const nextCursor = hasNext ? String(slicedRows[slicedRows.length - 1]?.id ?? "") : null;

  return {
    isEmpty: slicedRows.length === 0,
    contents: slicedRows.map((row) => ({
      id: row.id,
      name: row.name,
      scheduledOn: row.scheduledOn,
      status: row.status,
    })),
    hasNext,
    nextCursor,
  };
};

export const getGuestReminderList = async ({
  todoId,
  includeSent,
}: {
  todoId: number;
  includeSent: boolean;
}): Promise<RetrieveReminderResponseType[]> => {
  const reminderRows = await handleGetReminderRowsByTodoId(todoId);

  if (includeSent) {
    return reminderRows;
  }

  return reminderRows.filter((reminderRow) => !reminderRow.remindedAt);
};

export const createGuestReminder = async ({
  todoId,
  remindsAt,
}: {
  todoId: number;
  remindsAt: string;
}): Promise<ReminderIdResponseType> => {
  const database = await handleGetGuestDatabase();
  const result = await database.runAsync(
    "INSERT INTO todo_reminders (todo_id, reminds_at, reminded_at) VALUES (?, ?, NULL)",
    todoId,
    remindsAt,
  );

  return { id: Number(result.lastInsertRowId) };
};

export const updateGuestReminder = async ({ id, remindsAt }: { id: number; remindsAt: string }) => {
  const database = await handleGetGuestDatabase();
  await database.runAsync("UPDATE todo_reminders SET reminds_at = ? WHERE id = ?", remindsAt, id);

  return 204;
};

export const deleteGuestReminder = async ({ id }: { id: number }) => {
  const database = await handleGetGuestDatabase();
  await database.runAsync("DELETE FROM todo_reminders WHERE id = ?", id);

  return 204;
};
