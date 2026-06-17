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

// Export/import: a forma exata é definida pelo backend. O front só faz
// round-trip (baixa o que vem de /export e devolve o mesmo em /import),
// por isso mantemos os campos conhecidos tipados e o resto livre.
export type ProjectExport = {
  version?: number;
  project?: ProjectDto;
  [key: string]: unknown;
};
