import { Pressable, View } from "react-native";
import { BounceInLeft, BounceOutLeft } from "react-native-reanimated";

import Backdrop from "@/components/backdrop";
import { MotionView } from "@/components/motion";
import ProfileImage from "@/components/profile-image";
import { useToggle } from "@/hooks";
import { UserType } from "@/types/response/user";

import Avatar from "../../avatar";

export type AvatarListItem = {
  id: string | number;
  uri?: string;
  name?: string;
  onPress?: (id: string | number) => void;
};

export interface AvatarListProps {
  users: UserType[];
}

function AvatarList({ users }: AvatarListProps) {
  const { isToggle, handleToggle, handleToggleOff } = useToggle();

  return (
    <View className="relative inline-flex flex-row">
      <Pressable
        className="inline-flex items-center flex-row"
        onPress={handleToggle}
      >
        {users.slice(0, 2).map(({ userId, userName, userImage }, index) => (
          <View
            key={userId}
            className={`"relative h-[3rem] w-[3rem] overflow-hidden rounded-full" ${index === 1 && "-ml-[2.2rem] top-[0.3rem]"} ${index === 0 && "z-10 mb-[0.5rem]"}`}
          >
            <ProfileImage
              source={userImage}
              className="w-full h-full"
              alt={userName}
              priority="high"
            />
          </View>
        ))}
      </Pressable>
      <View className="absolute left-0 top-[-4.5rem] ">
        {isToggle && (
          <MotionView
            initial={{ type: BounceInLeft }}
            exit={{ type: BounceOutLeft }}
            whileTap={{ scale: 0.95 }}
            className="z-10 px-[0.5rem] py-[0.5rem] bg-white_100 shadow-shadow_500 rounded-radius5 flex-row"
          >
            {users.map((user) => (
              <View
                key={user.userId}
                className="mr-2 overflow-hidden rounded-full"
              >
                <Avatar
                  size="tiny"
                  user={user}
                />
              </View>
            ))}
          </MotionView>
        )}
        <Backdrop
          open={isToggle}
          onPress={handleToggleOff}
        />
      </View>
    </View>
  );
}

export default AvatarList;
