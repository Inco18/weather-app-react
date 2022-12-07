import React, { useEffect } from "react";

const useOutsideClick = (
  refArr: React.RefObject<{ contains(target: EventTarget | null): any }>[],
  handler: () => void
) => {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (refArr.every((ref) => !ref.current?.contains(event.target)))
        handler();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refArr]);
};

export default useOutsideClick;
