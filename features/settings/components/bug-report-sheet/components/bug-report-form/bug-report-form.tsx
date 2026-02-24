import { forwardRef, useImperativeHandle } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { ScrollView, View } from "react-native";

import { SpoqaText, TextInput } from "@/components";

import { BugReportFormValues, BugReportImageItem } from "../../bug-report-sheet.types";
import { ImageUpload } from "../image-upload";

export interface BugReportFormHandle {
  handleSubmit: () => void;
  handleReset: () => void;
  hasDraft: () => boolean;
}

interface BugReportFormProps {
  onSubmit: (values: BugReportFormValues) => void;
}

const TITLE_MAX_LENGTH = 50;
const CONTENT_MAX_LENGTH = 2000;

const defaultValues: BugReportFormValues = {
  title: "",
  content: "",
  images: [],
};

const BugReportForm = forwardRef<BugReportFormHandle, BugReportFormProps>(function BugReportForm(
  { onSubmit },
  ref,
) {
  const methods = useForm<BugReportFormValues>({
    defaultValues,
  });

  const title = useWatch({ control: methods.control, name: "title" }) ?? "";
  const content = useWatch({ control: methods.control, name: "content" }) ?? "";

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: () => {
        methods.handleSubmit((values) => onSubmit(values))();
      },
      handleReset: () => {
        methods.reset(defaultValues);
      },
      hasDraft: () => {
        const values = methods.getValues();

        return (
          values.title.trim().length > 0 ||
          values.content.trim().length > 0 ||
          values.images.length > 0
        );
      },
    }),
    [methods, onSubmit],
  );

  return (
    <FormProvider {...methods}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, rowGap: 16 }}
      >
        <View>
          <View className="mb-[0.8rem] flex-row justify-between">
            <SpoqaText className="text-size14 text-black_500">제목</SpoqaText>
            <SpoqaText className="text-size12 text-example_gray_900">
              {title.length}/{TITLE_MAX_LENGTH}
            </SpoqaText>
          </View>
          <TextInput
            name="title"
            maxLength={TITLE_MAX_LENGTH}
            placeholder="제목을 입력해 주세요."
          />
        </View>

        <View>
          <View className="mb-[0.8rem] flex-row justify-between">
            <SpoqaText className="text-size14 text-black_500">내용</SpoqaText>
            <SpoqaText className="text-size12 text-example_gray_900">
              {content.length}/{CONTENT_MAX_LENGTH}
            </SpoqaText>
          </View>
          <TextInput
            name="content"
            maxLength={CONTENT_MAX_LENGTH}
            multiline
            textAlignVertical="top"
            placeholder="발생한 문제를 상세하게 적어 주세요."
            className="min-h-[16rem] py-[1.2rem]"
          />
        </View>

        <View>
          <SpoqaText className="mb-[0.8rem] text-size14 text-black_500">이미지</SpoqaText>
          <Controller
            control={methods.control}
            name="images"
            render={({ field: { value = [], onChange } }) => {
              const handleAddImages = (nextImages: BugReportImageItem[]) => {
                if (nextImages.length === 0) {
                  return;
                }

                onChange([...value, ...nextImages]);
              };

              const handleRemoveImage = (imageId: string) => {
                onChange(value.filter((item) => item.id !== imageId));
              };

              return (
                <ImageUpload
                  items={value}
                  onAddImages={handleAddImages}
                  onRemoveImage={handleRemoveImage}
                  maxCount={10}
                />
              );
            }}
          />
        </View>
      </ScrollView>
    </FormProvider>
  );
});

export default BugReportForm;
