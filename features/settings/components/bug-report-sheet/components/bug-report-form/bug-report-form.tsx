import { forwardRef, useImperativeHandle } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { FormTextInput, SpoqaText } from "@/components";

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
  const { t } = useTranslation();
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
            <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
              {t("common.title")}
            </SpoqaText>
            <SpoqaText className="text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
              {title.length}/{TITLE_MAX_LENGTH}
            </SpoqaText>
          </View>
          <FormTextInput
            name="title"
            maxLength={TITLE_MAX_LENGTH}
            placeholder={t("settings.bugReportSheet.titlePlaceholder")}
          />
        </View>

        <View>
          <View className="mb-[0.8rem] flex-row justify-between">
            <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
              {t("common.content")}
            </SpoqaText>
            <SpoqaText className="text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
              {content.length}/{CONTENT_MAX_LENGTH}
            </SpoqaText>
          </View>
          <FormTextInput
            name="content"
            maxLength={CONTENT_MAX_LENGTH}
            multiline
            textAlignVertical="top"
            placeholder={t("settings.bugReportSheet.contentPlaceholder")}
            className="min-h-[16rem] py-[1.2rem]"
          />
        </View>

        <View>
          <SpoqaText className="mb-[0.8rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary">
            {t("common.image")}
          </SpoqaText>
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
