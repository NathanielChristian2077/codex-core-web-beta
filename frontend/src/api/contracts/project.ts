// Project = a antiga "Campaign". Forma do JSON em project_store.go.

export type ProjectDto = {
  id: string;
  ownerId?: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectRequest = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  // "rpg-campaign" semeia os NodeTypes character/location/object/event/faction.
  presetSlug?: string | null;
};

export type UpdateProjectRequest = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
};
