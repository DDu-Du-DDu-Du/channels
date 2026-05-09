import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [isFollow, setIsFollow] = useState(isFollowing);
  const [isFollowRequesting, setIsFollowRequesting] = useState(isRequestFollow);
  const [title, setTitle] = useState(t("follow.requestingTitle"));
  const [message, setMessage] = useState(t("follow.requestingMessage"));

  useEffect(() => {
    if (isFollow === true) {
      setTitle(t("follow.followingTitle"));
      setMessage(t("follow.followingMessage"));
      return;
    }

    setTitle(t("follow.requestingTitle"));
    setMessage(t("follow.requestingMessage"));
  }, [isFollow, t]);

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
