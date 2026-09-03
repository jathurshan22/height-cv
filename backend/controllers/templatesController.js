import Template from '../models/Template.js';

const mapTemplate = (t) => ({
  id: t.slug,
  slug: t.slug,
  name: t.name,
  description: t.description || '',
  accent: t.accent || '#4F46E5',
  category: t.category,
  isFeatured: t.isFeatured,
});

// Public: exactly the templates selected by the admin for Home + Create CV.
// Admin can select up to 6 using isFeatured.
export async function listFeaturedTemplates(req, res) {
  try {
    const templates = await Template.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({ createdAt: 1 })
      .limit(6);

    return res.json({ templates: templates.map(mapTemplate) });
  } catch (error) {
    console.error('Featured templates error:', error);
    return res.status(500).json({ message: 'Failed to load featured templates' });
  }
}

// Public/authenticated UI: all active templates added by the admin.
// Used by Dashboard -> Templates.
export async function listAllActiveTemplates(req, res) {
  try {
    const templates = await Template.find({ isActive: true }).sort({ createdAt: 1 });
    return res.json({ templates: templates.map(mapTemplate) });
  } catch (error) {
    console.error('All templates error:', error);
    return res.status(500).json({ message: 'Failed to load templates' });
  }
}

// Backward-compatible default endpoint: featured templates.
export const listPublicTemplates = listFeaturedTemplates;
