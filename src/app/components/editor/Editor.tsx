"use client";

import { BUTTON_TEXT, IMAGE_EDITOR_INPUT_TEXT } from "@/utils/text";
import { VariantTemplate } from "@/utils/types";
import { isDefined } from "@/utils/validators";
import clsx from "clsx";
import Canvas from "./Canvas";
import Crop from "./Crop";
import { EditorLoader } from "./EditorLoader";
import EditorMenu from "./EditorMenu";
import PanZoom from "./PanZoom";
import TextInputDialog from "./TextInputDialog";
import useEditorActions from "./useEditorActions";
import { ImgSource } from "./utils";

interface EditorProps {
  imgSrc: ImgSource;
  onUploadImage: () => void;
  onEditComplete: (file: File) => Promise<void>;
  template: VariantTemplate;
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
  } = useEditorActions(props);

  return (
    <div
      className={clsx(
        "mt-4 mb-10 relative flex flex-1 flex-col-reverse md:flex-row items-stretch justify-between border-2 border-neutral-800 rounded-lg overflow-hidden",
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
          "flex flex-col flex-1 w-full h-auto items-center relative",
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
            className="dark bg-transparent rounded-lg p-2 md:p-4 flex-1"
            onCropComplete={handleCropComplete}
            onCancel={() => setIsCropActive(false)}
            canvas={fCanvas}
          />
        )}
        <PanZoom
          controlsRef={panZoomControlsRef}
          disabled={!isPanZoomActive}
          wrapperStyle={{
            display: isCropActive ? "none" : undefined,
          }}
        >
          <Canvas
            className={clsx("rounded-lg", isCropActive && "hidden")}
            imgSrc={imgSources.src}
            canvas={fCanvas}
            loadCanvas={setFCanvas}
            template={props.template}
            disabled={isPanZoomActive}
          />
        </PanZoom>
      </div>
    </div>
  );
}
