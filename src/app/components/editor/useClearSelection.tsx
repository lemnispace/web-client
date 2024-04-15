import { Canvas } from "fabric";
import { useEffect } from "react";

type ClearSelectionEvent = KeyboardEvent | TouchEvent | MouseEvent;

const useClearSelection = (
  canvas: Canvas | null,
  canvasElement: HTMLCanvasElement | null
) => {
  useEffect(() => {
    if (!canvas || !canvasElement) return;

    const handleClearSelection = (event: ClearSelectionEvent) => {
      const isKeydownEvent = event.type === "keydown";
      const isEscapeKey = (event as KeyboardEvent).key === "Escape";

      if (isKeydownEvent && isEscapeKey) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        return;
      }

      const isTouchOrMouseEvent =
        event.type === "touchstart" || event.type === "mousedown";

      if (
        isTouchOrMouseEvent &&
        !(event.target instanceof canvasElement.constructor)
      ) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    };

    document.addEventListener("keydown", handleClearSelection);
    document.addEventListener("touchstart", handleClearSelection);
    document.addEventListener("mousedown", handleClearSelection);

    return () => {
      document.removeEventListener("keydown", handleClearSelection);
      document.removeEventListener("touchstart", handleClearSelection);
      document.removeEventListener("mousedown", handleClearSelection);
    };
  }, [canvas, canvasElement]);
};

export default useClearSelection;
