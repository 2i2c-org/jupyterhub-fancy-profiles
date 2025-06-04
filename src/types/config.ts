interface IChoice {
  display_name: string;
  description?: string;
  default?: boolean;
  slug?: string;
  kubespawner_overwrite: {
    [key: string]: string;
  };
}

interface IUnlistedChoice {
  enabled: boolean;
  display_name: string;
  display_name_in_choices?: string;
  description_in_choices?: string;
  validation_regex: string;
  validation_message?: string;
  kubespawner_override: {
    [key: string]: string;
  };
}

export interface IProfileOption {
  display_name: string;
  unlisted_choice?: IUnlistedChoice;
  dynamic_image_building?: {
    enabled: boolean;
  };
  choices: {
    [key: string]: IChoice;
  };
}

export interface IProfileOptions {
  image: IProfileOption;
  resources?: IProfileOption;
}

export interface IProfile {
  display_name: string;
  description?: string;
  default?: boolean;
  slug: string;
  profile_options?: IProfileOptions;
}

export type IJupytherHubWindowObject = Window &
  typeof globalThis & {
    profileList: IProfile[];
  };
