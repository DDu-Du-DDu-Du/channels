import { useEffect, useState } from "react";

interface UseToggleFollowProps {
  isFollowing: boolean;
  isPrivate: boolean;
  isRequestFollow: boolean;
  openModal: () => void;
}

function useToggleFollow({
  isFollowing,
  isPrivate,
  isRequestFollow,
  openModal,
}: UseToggleFollowProps) {
  const [isFollow, setIsFollow] = useState(isFollowing);
  const [isFollowRequesting, setIsFollowRequesting] = useState(isRequestFollow);
  const [title, setTitle] = useState("팔로잉 요청 중이에요.");
  const [message, setMessage] = useState("팔로잉 요청을 취소할까요?");

  useEffect(() => {
    if (isFollow === true) {
      setTitle("팔로잉 중입니다.");
      setMessage("팔로잉을 취소하시겠어요?");
    }
  }, [isFollow]);

  const handleFollowCheck = (isComplete: boolean) => {
    if (!isComplete) {
      return;
    }

    setIsFollow(false);
    setIsFollowRequesting(false);
  };

  const handleToggleFollow = () => {
    if (!isPrivate) {
      setIsFollow((prev) => !prev);

      return;
    }

    if (isFollow === false) {
      setIsFollowRequesting(true);
      setIsFollow(true);

      return;
    }

    openModal();
  };

  return { isFollow, isFollowRequesting, title, message, handleToggleFollow, handleFollowCheck };
}

export default useToggleFollow;
