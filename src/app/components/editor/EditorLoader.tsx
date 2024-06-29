import { Loader } from "@/components/loader";

export type EditorLoadStatus = "loading" | "idle" | "error";

interface EditorLoaderProps {
  status: EditorLoadStatus;
  statusMessage?: string;
}

export const EditorLoader = ({ status, statusMessage }: EditorLoaderProps) => {
  if (status !== "loading") {
    return null;
  }
  return (
    <div className="h-full w-full bg-gray-900/75 flex flex-col items-center justify-center absolute cursor-wait z-50">
      <Loader
        status={status}
        className="fill-secondary-500 w-10 h-10"
        pathColor="#E5E5E5"
      />
      {!!statusMessage && (
        <p className="text-neutral-200 font-semibold py-2 text-xs sm:text-sm md:text-base text-center">
          {statusMessage}
        </p>
      )}
    </div>
  );
};
