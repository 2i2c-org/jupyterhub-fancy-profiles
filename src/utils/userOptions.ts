import { IProfile } from "../types/config";

export type TUserOptions = Record<string, string>;

/**
 * Converts the user_options that KubeSpawner saved on the last spawn into
 * the same shape as the permalink values, so the form can pre-select them.
 * Values that no longer match the profile list are dropped.
 */
export function userOptionsToFormValues(
  userOptions: TUserOptions | undefined,
  profileList: IProfile[],
): Record<string, string> {
  const profile = profileList.find(({ slug }) => slug === userOptions?.profile);
  if (!profile) return {};

  const values: Record<string, string> = { profile: profile.slug };
  for (const [key, option] of Object.entries(profile.profile_options || {})) {
    const unlistedChoice = userOptions[`${key}--unlisted-choice`];
    const choice = userOptions[key];
    if (unlistedChoice && option.unlisted_choice?.enabled) {
      values[key] = "unlisted_choice";
      values[`${key}:unlisted_choice`] = unlistedChoice;
    } else if (choice && Object.prototype.hasOwnProperty.call(option.choices || {}, choice)) {
      values[key] = choice;
    }
  }
  return values;
}
