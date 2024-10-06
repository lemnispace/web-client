import { Template } from "@/lib/printful/types";
import { VariantTemplate } from "./types";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Printful Templates                             ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export const mapPrintfulTemplates = (
  templates: Template[]
): VariantTemplate[] => {
  return templates.map((t) => ({
    // convert snake_case to camelCase
    templateId: t.template_id,
    imageUrl: t.image_url,
    backgroundUrl: t.background_url,
    backgroundColor: t.background_color,
    printfileId: t.printfile_id,
    templateWidth: t.template_width,
    templateHeight: t.template_height,
    printAreaWidth: t.print_area_width,
    printAreaHeight: t.print_area_height,
    printAreaTop: t.print_area_top,
    printAreaLeft: t.print_area_left,
    isTemplateOnFront: t.is_template_on_front,
    orientation: t.orientation,
    conflictingPlacements: t.conflicting_placements,
  }));
};

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Utility Mappers                                ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

/**
 * Filters an object by removing properties with falsy values.
 *
 * @param obj - The object to filter.
 * @returns A new object with only the properties that have truthy values.
 */
export const filterObject = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => Boolean(value))
  ) as Partial<T>;
};
