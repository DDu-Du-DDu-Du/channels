export type DeviceTokenChannelType = "WEB";

export interface DeviceTokenRegisterRequestType {
  channel: DeviceTokenChannelType;
  token: string;
}
