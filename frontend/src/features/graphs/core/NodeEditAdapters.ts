import {
  deleteEvent,
  updateEvent,
} from "../../campaigns/api";
import {
  deleteCharacter,
  updateCharacter,
} from "../../characters/api";

import {
  deleteLocation,
  updateLocation,
} from "../../locations/api";

import {
  deleteObject,
  updateObject,
} from "../../objects/api";

import type { GraphNodeType } from "../types";

export type EditableNodeData = {
  title?: string;
  description?: string | null;
};

type NodeEditAdapter = {
  update: (id: string, data: EditableNodeData) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const nodeEditAdapters: Record<GraphNodeType, NodeEditAdapter> = {
  EVENT: {
    async update(id, data) {
      const payload: { title?: string; description?: string | null } = {};

      if (data.title !== undefined) {
        payload.title = data.title.trim();
      }

      if (data.description !== undefined) {
        payload.description =
          data.description === null
            ? null
            : data.description.trim() || null;
      }

      await updateEvent(id, payload);
    },
    async remove(id) {
      await deleteEvent(id);
    },
  },

  CHARACTER: {
    async update(id, data) {
      const payload: { name?: string; description?: string | null } = {};

      if (data.title !== undefined) {
        payload.name = data.title.trim();
      }

      if (data.description !== undefined) {
        payload.description =
          data.description === null
            ? null
            : data.description.trim() || null;
      }

      await updateCharacter(id, payload as any);
    },
    async remove(id) {
      await deleteCharacter(id);
    },
  },

  LOCATION: {
    async update(id, data) {
      const payload: { name?: string; description?: string | null } = {};

      if (data.title !== undefined) {
        payload.name = data.title.trim();
      }

      if (data.description !== undefined) {
        payload.description =
          data.description === null
            ? null
            : data.description.trim() || null;
      }

      await updateLocation(id, payload as any);
    },
    async remove(id) {
      await deleteLocation(id);
    },
  },

  OBJECT: {
    async update(id, data) {
      const payload: { name?: string; description?: string | null } = {};

      if (data.title !== undefined) {
        payload.name = data.title.trim();
      }

      if (data.description !== undefined) {
        payload.description =
          data.description === null
            ? null
            : data.description.trim() || null;
      }

      await updateObject(id, payload as any);
    },
    async remove(id) {
      await deleteObject(id);
    },
  },
};
