import { useEffect } from "react";

const DEFAULT_TITLE = "Mujeres en STEM";

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  }, [title]);
}
