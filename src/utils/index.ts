import { IProfileOption } from "../types/config";

export function hasDynamicImageBuilding(
  key: string,
  option: IProfileOption,
): boolean {
  return (
    key === "image" &&
    option.dynamic_image_building?.enabled &&
    option.unlisted_choice?.enabled
  );
}
