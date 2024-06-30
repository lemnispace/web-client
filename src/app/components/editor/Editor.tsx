"use client";
import { Button } from "@/components/button";
import { BUTTON_TEXT, IMAGE_EDITOR_INPUT_TEXT } from "@/utils/text";
import { VariantTemplate } from "@/utils/types";
import { isDefined } from "@/utils/validators";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Canvas from "./Canvas";
import Crop from "./Crop";
import { EditorLoader } from "./EditorLoader";
import EditorMenu, { EditorControlItemProps } from "./EditorMenu";
import PanZoom from "./PanZoom";
import TextInputDialog from "./TextInputDialog";
import useEditorActions from "./useEditorActions";
import { ImgSource } from "./utils";

interface EditorProps {
  imgSrc: ImgSource;
  imgName?: string;
  customActions?: EditorControlItemProps[];
  onUploadImage: () => void;
  onEditComplete: (file: File) => Promise<void>;
  template: VariantTemplate;
  backHref: string;
}

export default function Editor(props: EditorProps) {
  const {
    actions,
    fCanvas,
    setFCanvas,
    isCropActive,
    setIsCropActive,
    isPreviewOpen,
    setIsPreviewOpen,
    isPanZoomActive,
    status,
    statusMessage,
    imgSources,
    panZoomControlsRef,
    handleCropComplete,
    handleSubmitPreview,
    handleFinishEdit,
  } = useEditorActions(props);

  return (
    <>
      <div
        className={clsx(
          "mt-4 relative flex flex-1 flex-col-reverse md:flex-row items-stretch justify-between border-2 border-neutral-800 rounded-lg overflow-hidden",
          isDefined(props.template.backgroundColor)
            ? `bg-[${props.template.backgroundColor}]`
            : "bg-neutral-900"
        )}
      >
        <EditorMenu
          actions={actions}
          disabled={status === "loading" || !fCanvas || isCropActive}
          className="flex-row md:flex-col"
        />
        <div
          className={clsx(
            "flex-1 w-full h-auto items-center relative",
            isCropActive ? "block overflow-hidden" : "flex overflow-auto",
            isCropActive && "bg-neutral-900"
          )}
        >
          <TextInputDialog
            open={isPreviewOpen}
            title={IMAGE_EDITOR_INPUT_TEXT.title}
            label={IMAGE_EDITOR_INPUT_TEXT.label}
            onClose={() => setIsPreviewOpen(false)}
            onSubmit={handleSubmitPreview}
            cta={BUTTON_TEXT.generate}
            description={IMAGE_EDITOR_INPUT_TEXT.description}
            name="text"
            error={status === "error" ? statusMessage : undefined}
          />
          <EditorLoader status={status} statusMessage={statusMessage} />
          {isCropActive && (
            <Crop
              imgSrc={imgSources.originalImgSrc}
              aspectRatio={
                props.template.printAreaWidth / props.template.printAreaHeight
              }
              className="dark bg-transparent rounded-lg p-2 md:p-4"
              onCropComplete={handleCropComplete}
              onCancel={() => setIsCropActive(false)}
              canvas={fCanvas}
            />
          )}
          <PanZoom controlsRef={panZoomControlsRef} disabled={!isPanZoomActive}>
            <Canvas
              className={clsx("rounded-lg", isCropActive && "hidden")}
              imgSrc={imgSources.src}
              canvas={fCanvas}
              loadCanvas={setFCanvas}
              template={props.template}
            />
          </PanZoom>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-row items-center justify-end my-10">
        <Button
          color="primary"
          onClick={handleFinishEdit}
          disabled={status === "loading"}
          className="w-full max-w-80 min-w-fit sm:w-6/12 lg:w-3/12 md:w-4/12"
        >
          {BUTTON_TEXT.finishEdit}
        </Button>
        <Button
          outline
          href={props.backHref}
          disabled={status === "loading"}
          className="ml-4 max-w-40 min-w-fit w-full sm:w-4/12 lg:w-2/12 md:w-2/12"
        >
          <ArrowLeftIcon className="h-6 w-6 stroke-neutral-800" />
          {BUTTON_TEXT.back}
        </Button>
      </div>
    </>
  );
}
