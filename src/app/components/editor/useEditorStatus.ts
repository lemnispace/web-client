import { useCallback, useState } from "react";
import { EditorLoadStatus } from "./EditorLoader";

interface BaseStatusUpdate {
  status: EditorLoadStatus;
}

interface IdleStatusUpdate extends BaseStatusUpdate {
  status: "idle";
}

interface LoadingStatusUpdate extends BaseStatusUpdate {
  status: "loading";
  message?: string;
}

interface ErrorStatusUpdate extends BaseStatusUpdate {
  status: "error";
  message: string;
}

type StatusUpdate = IdleStatusUpdate | LoadingStatusUpdate | ErrorStatusUpdate;

const useEditorStatus = () => {
  const [status, setStatus] = useState<EditorLoadStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const updateStatus = useCallback((update: StatusUpdate) => {
    switch (update.status) {
      case "loading":
        setStatus("loading");
        setStatusMessage(update.message || "");
        return;
      case "error":
        setStatus("error");
        setStatusMessage(update.message);
        return;
      default:
        setStatus("idle");
        setStatusMessage("");
        return;
    }
  }, []);

  return { status, statusMessage, updateStatus };
};

export default useEditorStatus;
