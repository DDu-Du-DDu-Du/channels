import { fetchApi } from "@/api";
import { DEVICE_TOKEN } from "@/constants/end-points";
import type { DeviceTokenRegisterRequestType } from "@/types/request/device-token/device-token";
import type { DeviceTokenRegisterResponseType } from "@/types/response/device-token/device-token";

export async function registerDeviceToken({
  channel,
  token,
}: DeviceTokenRegisterRequestType): Promise<DeviceTokenRegisterResponseType> {
  const response = await fetchApi(
    DEVICE_TOKEN.REGISTER,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel,
        token,
      }),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
