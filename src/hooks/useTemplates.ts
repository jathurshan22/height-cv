import { useEffect, useState } from 'react';
import { api, type TemplateMeta } from '../services/api';

/**
 * Loads the active CV templates from the backend.
 * Returns an empty list while loading or if the request fails,
 * so callers should guard on `loading` before indexing.
 */
export function useTemplates(scope: 'featured' | 'all' = 'featured') {
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const request = scope === 'all' ? api.listAllTemplates() : api.listFeaturedTemplates();

    request
      .then((res) => {
        if (active) setTemplates(res.templates || []);
      })
      .catch(() => {
        if (active) setTemplates([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [scope]);

  return { templates, loading };
}
