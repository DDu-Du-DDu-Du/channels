import { useToast } from "@/components/toast/hooks";
import { FEED_KEY } from "@/constants/query-key/query-key";
import {
  fetchCreateDDuDu,
  fetchDDuDuChangeDate,
  fetchDDuDuChangeTime,
  fetchEditDDuDu,
} from "@/service/feed/feed";
import type { CreateDDuDuResponseType } from "@/types/response/feed/ddudu";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { DDuDuEditorSubmitPayloadType } from "../../ddudu.types";

interface UseDDuDuEditorMutationProps {
  mode: "create" | "edit";
  goalId?: number;
  dduduId?: number;
  selectedDDuDuDate: string;
  onSuccess: () => void;
}

const useDDuDuEditorMutation = ({
  mode,
  goalId,
  dduduId,
  selectedDDuDuDate,
  onSuccess,
}: UseDDuDuEditorMutationProps) => {
  const queryClient = useQueryClient();
  const { createToast } = useToast();

  const createDDuDuMutation = useMutation({
    mutationKey: [FEED_KEY.CREATE_DDUDU],
    mutationFn: fetchCreateDDuDu,
  });

  const editDDuDuMutation = useMutation({
    mutationKey: [FEED_KEY.EDIT_DDUDU],
    mutationFn: fetchEditDDuDu,
  });

  const changeDDuDuDateMutation = useMutation({
    mutationKey: [FEED_KEY.DDUDU_CHANGE_DATE],
    mutationFn: fetchDDuDuChangeDate,
  });

  const changeDDuDuTimeMutation = useMutation({
    mutationKey: [FEED_KEY.DDUDU_CHANGE_TIME],
    mutationFn: fetchDDuDuChangeTime,
  });

  const handleRefetchFeedQueries = async () => {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: [FEED_KEY.MONTHLY_DDUDUS] }),
      queryClient.refetchQueries({ queryKey: [FEED_KEY.WEEKLY_DDUDUS] }),
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_LIST, selectedDDuDuDate] }),
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedDDuDuDate] }),
    ]);
  };

  const handleChangeTimeIfNeeded = async (
    targetDDuDuId: number,
    payload: DDuDuEditorSubmitPayloadType,
  ) => {
    if (!payload.isBeginTimeEnabled) {
      await changeDDuDuTimeMutation.mutateAsync({
        id: targetDDuDuId,
        time: {
          beginAt: null,
          endAt: null,
        },
      });
      return;
    }

    if (!payload.beginAt) {
      return;
    }

    const beginAt = payload.beginAt;
    const endAt = payload.isEndTimeEnabled && payload.endAt ? payload.endAt : null;

    await changeDDuDuTimeMutation.mutateAsync({
      id: targetDDuDuId,
      time: {
        beginAt,
        endAt,
      },
    });
  };

  const handleSubmit = async (payload: DDuDuEditorSubmitPayloadType) => {
    try {
      if (mode === "create") {
        if (!goalId) {
          createToast("목표 정보가 없어 뚜두를 생성할 수 없어요.", { type: "danger" });
          return false;
        }

        const response = (await createDDuDuMutation.mutateAsync({
          requestDDuDu: {
            goalId,
            name: payload.title,
            scheduledOn: payload.scheduledOn,
          },
        })) as CreateDDuDuResponseType;

        if (!response?.id) {
          createToast("뚜두 생성은 완료됐지만 상세 저장은 건너뛰었어요.", { type: "warning" });
        } else {
          await handleChangeTimeIfNeeded(response.id, payload);

          // TODO: to-be added after server implementation (reminder save API call)
        }
      }

      if (mode === "edit") {
        if (!dduduId) {
          createToast("뚜두 정보가 없어 수정할 수 없어요.", { type: "danger" });
          return false;
        }

        await editDDuDuMutation.mutateAsync({
          id: dduduId,
          name: payload.title,
        });

        if (payload.scheduledOn !== selectedDDuDuDate) {
          await changeDDuDuDateMutation.mutateAsync({
            id: dduduId,
            date: payload.scheduledOn,
          });
        }

        await handleChangeTimeIfNeeded(dduduId, payload);

        // TODO: to-be added after server implementation (reminder save API call)
      }

      await handleRefetchFeedQueries();
      onSuccess();
      return true;
    } catch {
      createToast(mode === "create" ? "뚜두 생성에 실패했어요." : "뚜두 수정에 실패했어요.", {
        type: "danger",
      });
      return false;
    }
  };

  return {
    isPending:
      createDDuDuMutation.isPending ||
      editDDuDuMutation.isPending ||
      changeDDuDuDateMutation.isPending ||
      changeDDuDuTimeMutation.isPending,
    handleSubmit,
  };
};

export default useDDuDuEditorMutation;
