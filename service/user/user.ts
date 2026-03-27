import { fetchApi } from "@/api";
import { USER } from "@/constants/end-points";
import {
  AppConnectionSettingsType,
  DisplaySettingsType,
  MenuActivationSettingsType,
  UserSettingsResponseType,
} from "@/types/response/user/settings";

interface GetMeParams {
  accessToken: string;
}

export async function getMe({ accessToken }: GetMeParams) {
  const response = await fetchApi(
    USER.ME,
    {
      headers: {
        accept: "application/json",
      },
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

interface UpdateUserSettingsParams {
  display: DisplaySettingsType;
  menuActivation: MenuActivationSettingsType;
  appConnection: AppConnectionSettingsType;
}

export async function getUserSettings(): Promise<UserSettingsResponseType> {
  const response = await fetchApi(USER.SETTINGS, { method: "GET" }, true);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function updateUserSettings({
  display,
  menuActivation,
  appConnection,
}: UpdateUserSettingsParams): Promise<UserSettingsResponseType> {
  const response = await fetchApi(
    USER.SETTINGS,
    {
      method: "PUT",
      body: JSON.stringify({
        display,
        menuActivation,
        appConnection,
      }),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
