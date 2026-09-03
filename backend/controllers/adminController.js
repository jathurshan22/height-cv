import User from '../models/User.js';
import CV from '../models/CV.js';
import Template from '../models/Template.js';
import AIUsage from '../models/AIUsage.js';
import ATSAnalysis from '../models/ATSAnalysis.js';
import JobMatch from '../models/JobMatch.js';
import AuditLog from '../models/AuditLog.js';
import SupportTicket from '../models/SupportTicket.js';
import SystemSettings from '../models/SystemSettings.js';

/*
|--------------------------------------------------------------------------
| Public User
|--------------------------------------------------------------------------
*/

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: user.avatar || '',
  role: user.role || 'user',
  status: user.status || 'active',
  createdAt: user.createdAt,
  lastLogin: user.lastLogin || null,
});

/*
|--------------------------------------------------------------------------
| Audit Log
|--------------------------------------------------------------------------
*/

async function log(
  req,
  action,
  targetType = '',
  targetId = '',
  description = ''
) {
  try {
    await AuditLog.create({
      admin: req.user._id,
      action,
      targetType,
      targetId,
      description,
      ipAddress: req.ip || '',
    });
  } catch (error) {
    console.error(
      'Audit log error:',
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| DASHBOARD STATS
|--------------------------------------------------------------------------
*/

export async function stats(req, res) {
  try {
    const [
      users,
      cvs,
      blocked,
      published,
      drafts,
      aiRequests,
      atsAnalyses,
      jobMatches,
      activeTemplates,
    ] = await Promise.all([
      User.countDocuments(),

      CV.countDocuments(),

      User.countDocuments({
        status: 'blocked',
      }),

      CV.countDocuments({
        status: 'published',
      }),

      CV.countDocuments({
        status: 'draft',
      }),

      AIUsage.countDocuments(),

      ATSAnalysis.countDocuments(),

      JobMatch.countDocuments(),

      Template.countDocuments({
        isActive: true,
      }),
    ]);

    return res.json({
      stats: {
        users,
        cvs,
        blocked,
        published,
        drafts,
        aiRequests,
        atsAnalyses,
        jobMatches,
        activeTemplates,
      },
    });
  } catch (error) {
    console.error(
      'Admin stats error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to load dashboard statistics',
    });
  }
}

/*
|--------------------------------------------------------------------------
| ANALYTICS
|--------------------------------------------------------------------------
*/

export async function analytics(
  req,
  res
) {
  try {
    const [
      aiByFeature,
      aiSuccess,
      aiErrors,
      atsAgg,
      jobAgg,
      recentAI,
    ] = await Promise.all([
      AIUsage.aggregate([
        {
          $group: {
            _id: '$feature',
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      AIUsage.countDocuments({
        status: 'success',
      }),

      AIUsage.countDocuments({
        status: 'error',
      }),

      ATSAnalysis.aggregate([
        {
          $group: {
            _id: null,
            avg: {
              $avg: '$score',
            },
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      JobMatch.aggregate([
        {
          $group: {
            _id: null,
            avg: {
              $avg: '$matchScore',
            },
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      AIUsage.find()
        .populate(
          'user',
          'name email'
        )
        .sort({
          createdAt: -1,
        })
        .limit(12)
        .lean(),
    ]);

    const aiTotal =
      aiSuccess + aiErrors;

    const avgATS = Number(
      (atsAgg[0]?.avg || 0).toFixed(1)
    );

    const avgJobMatch = Number(
      (jobAgg[0]?.avg || 0).toFixed(1)
    );

    return res.json({
      analytics: {
        aiTotal,

        aiSuccess,

        aiErrors,

        aiByFeature,

        avgATS,

        atsTotal:
          atsAgg[0]?.count || 0,

        avgJobMatch,

        jobMatchesTotal:
          jobAgg[0]?.count || 0,

        recentAI,
      },
    });
  } catch (error) {
    console.error(
      'Admin analytics error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to load analytics',
    });
  }
}

/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

export async function users(
  req,
  res
) {
  try {
    const list =
      await User.find()
        .select('-password')
        .sort({
          createdAt: -1,
        })
        .limit(500)
        .lean();

    return res.json({
      users: list.map(publicUser),
    });
  } catch (error) {
    console.error(
      'Admin users error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to load users',
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
*/

export async function updateUser(
  req,
  res
) {
  try {
    const {
      status,
      role,
    } = req.body;

    const userId =
      req.params.id;

    /*
     * Validate status
     */

    if (
      status &&
      !['active', 'blocked'].includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid user status',
      });
    }

    /*
     * Validate role
     */

    if (
      role &&
      !['user', 'admin'].includes(
        role
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid user role',
      });
    }

    /*
     * Prevent admin from blocking himself
     */

    if (
      userId ===
        req.user._id.toString() &&
      status === 'blocked'
    ) {
      return res.status(400).json({
        message:
          'You cannot block yourself',
      });
    }

    /*
     * Prevent admin from removing
     * his own admin role
     */

    if (
      userId ===
        req.user._id.toString() &&
      role === 'user'
    ) {
      return res.status(400).json({
        message:
          'You cannot remove your own admin access',
      });
    }

    /*
     * Build update safely
     */

    const update = {};

    if (status) {
      update.status = status;
    }

    if (role) {
      update.role = role;
    }

    if (
      Object.keys(update).length === 0
    ) {
      return res.status(400).json({
        message:
          'No valid update provided',
      });
    }

    const user =
      await User.findByIdAndUpdate(
        userId,
        update,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      return res.status(404).json({
        message:
          'User not found',
      });
    }

    /*
     * Audit status change
     */

    if (status === 'blocked') {
      await log(
        req,
        'block_user',
        'User',
        userId,
        `Blocked ${user.email}`
      );
    }

    if (status === 'active') {
      await log(
        req,
        'unblock_user',
        'User',
        userId,
        `Unblocked ${user.email}`
      );
    }

    /*
     * Audit role change
     */

    if (role) {
      await log(
        req,
        'change_role',
        'User',
        userId,
        `Changed ${user.email} role to ${role}`
      );
    }

    return res.json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error(
      'Update user error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to update user',
    });
  }
}

/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
*/

export async function deleteUser(
  req,
  res
) {
  try {
    const userId =
      req.params.id;

    /*
     * Prevent self-delete
     */

    if (
      userId ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        message:
          'You cannot delete yourself',
      });
    }

    const user =
      await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message:
          'User not found',
      });
    }

    /*
     * Delete user's CVs
     */

    await CV.deleteMany({ user: userId });
    await ATSAnalysis.deleteMany({ user: userId });
    await JobMatch.deleteMany({ user: userId });
    await AIUsage.deleteMany({ user: userId });
    await AuditLog.deleteMany({ admin: userId });
    await SupportTicket.deleteMany({ user: userId });

    /*
     * Delete user
     */

    await User.findByIdAndDelete(
      userId
    );

    /*
     * Audit
     */

    await log(
      req,
      'delete_user',
      'User',
      userId,
      `Deleted ${user.email} and all associated CVs`
    );

    return res.json({
      message:
        'User and associated CVs deleted successfully',
    });
  } catch (error) {
    console.error(
      'Delete user error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to delete user',
    });
  }
}

/*
|--------------------------------------------------------------------------
| CV MANAGEMENT
|--------------------------------------------------------------------------
*/

export async function cvs(
  req,
  res
) {
  try {
    const list =
      await CV.find()
        .populate(
          'user',
          'name email'
        )
        .sort({
          updatedAt: -1,
        })
        .limit(500)
        .lean();

    return res.json({
      cvs: list,
    });
  } catch (error) {
    console.error(
      'Admin CV error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to load CVs',
    });
  }
}

/*
|--------------------------------------------------------------------------
| DELETE CV
|--------------------------------------------------------------------------
*/

export async function deleteCV(
  req,
  res
) {
  try {
    const cvId =
      req.params.id;

    const cv =
      await CV.findById(cvId);

    if (!cv) {
      return res.status(404).json({
        message:
          'CV not found',
      });
    }

    await CV.findByIdAndDelete(cvId);
    await ATSAnalysis.deleteMany({ cv: cvId });
    await JobMatch.deleteMany({ cv: cvId });

    await log(
      req,
      'delete_cv',
      'CV',
      cvId,
      cv.title || 'Untitled CV'
    );

    return res.json({
      message:
        'CV deleted successfully',
    });
  } catch (error) {
    console.error(
      'Delete CV error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to delete CV',
    });
  }
}

/*
|--------------------------------------------------------------------------
| TEMPLATES
|--------------------------------------------------------------------------
*/

export async function templates(
  req,
  res
) {
  try {
    const list =
      await Template.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.json({
      templates: list,
    });
  } catch (error) {
    console.error(
      'Templates error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to load templates',
    });
  }
}

/*
|--------------------------------------------------------------------------
| CREATE TEMPLATE
|--------------------------------------------------------------------------
*/

export async function createTemplate(
  req,
  res
) {
  try {
    const {
      name,
      slug,
      preview = '',
      category = 'professional',
      isActive = true,
      isFeatured = false,
    } = req.body;

    if (
      !name?.trim() ||
      !slug?.trim()
    ) {
      return res.status(400).json({
        message:
          'Template name and slug are required',
      });
    }

    const normalizedSlug =
      slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');

    const existing =
      await Template.findOne({
        slug: normalizedSlug,
      });

    if (existing) {
      return res.status(409).json({
        message:
          'A template with this slug already exists',
      });
    }

    if (isFeatured) {
      const featuredCount = await Template.countDocuments({ isFeatured: true });
      if (featuredCount >= 6) {
        return res.status(400).json({
          message: 'Only 6 templates can be selected for Home and Create CV',
        });
      }
    }

    const template =
      await Template.create({
        name: name.trim(),
        slug: normalizedSlug,
        preview,
        category,
        isActive,
        isFeatured,
      });

    await log(
      req,
      'create_template',
      'Template',
      template._id.toString(),
      `Created template ${template.name}`
    );

    return res.status(201).json({
      template,
    });
  } catch (error) {
    console.error(
      'Create template error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to create template',
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE TEMPLATE
|--------------------------------------------------------------------------
*/

export async function updateTemplate(
  req,
  res
) {
  try {
    const templateId =
      req.params.id;

    const allowed = [
      'name',
      'slug',
      'preview',
      'category',
      'isActive',
      'isFeatured',
    ];

    const update = {};

    for (const field of allowed) {
      if (
        req.body[field] !== undefined
      ) {
        update[field] =
          req.body[field];
      }
    }

    if (update.name) {
      update.name =
        String(update.name).trim();
    }

    if (update.isFeatured === true) {
      const featuredCount = await Template.countDocuments({
        isFeatured: true,
        _id: { $ne: templateId },
      });

      if (featuredCount >= 6) {
        return res.status(400).json({
          message: 'Only 6 templates can be selected for Home and Create CV',
        });
      }
    }

    if (update.slug) {
      update.slug =
        String(update.slug)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-');

      const duplicate =
        await Template.findOne({
          slug: update.slug,
          _id: {
            $ne: templateId,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          message:
            'A template with this slug already exists',
        });
      }
    }

    const template =
      await Template.findByIdAndUpdate(
        templateId,
        update,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!template) {
      return res.status(404).json({
        message:
          'Template not found',
      });
    }

    await log(
      req,
      'update_template',
      'Template',
      templateId,
      `Updated template ${template.name}`
    );

    return res.json({
      template,
    });
  } catch (error) {
    console.error(
      'Update template error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to update template',
    });
  }
}

/*
|--------------------------------------------------------------------------
| DELETE TEMPLATE
|--------------------------------------------------------------------------
*/

export async function deleteTemplate(
  req,
  res
) {
  try {
    const templateId =
      req.params.id;

    const template =
      await Template.findById(
        templateId
      );

    if (!template) {
      return res.status(404).json({
        message:
          'Template not found',
      });
    }

    await Template.findByIdAndDelete(
      templateId
    );

    await log(
      req,
      'delete_template',
      'Template',
      templateId,
      `Deleted template ${template.name}`
    );

    return res.json({
      message:
        'Template deleted successfully',
    });
  } catch (error) {
    console.error(
      'Delete template error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to delete template',
    });
  }
}

/*
|--------------------------------------------------------------------------
| AUDIT LOGS
|--------------------------------------------------------------------------
*/

export async function logs(
  req,
  res
) {
  try {
    const list =
      await AuditLog.find()
        .populate(
          'admin',
          'name email'
        )
        .sort({
          createdAt: -1,
        })
        .limit(300)
        .lean();

    return res.json({
      logs: list,
    });
  } catch (error) {
    console.error(
      'Audit logs error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to load audit logs',
    });
  }
}

/*
|--------------------------------------------------------------------------
| SYSTEM SETTINGS
|--------------------------------------------------------------------------
*/

export async function settings(
  req,
  res
) {
  try {
    let settings =
      await SystemSettings.findOne({
        key: 'global',
      });

    if (!settings) {
      settings =
        await SystemSettings.create({
          key: 'global',
        });
    }

    return res.json({
      settings,
    });
  } catch (error) {
    console.error(
      'Settings error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to load system settings',
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE SYSTEM SETTINGS
|--------------------------------------------------------------------------
*/

export async function updateSettings(
  req,
  res
) {
  try {
    const allowed = [
      'appName',
      'maintenanceMode',
      'registrationEnabled',
      'aiEnabled',
      'defaultTemplate',
      'maxCVs',
      'maxAIRequests',
      'announcement',
    ];

    const update = {};

    for (const field of allowed) {
      if (
        req.body[field] !== undefined
      ) {
        update[field] =
          req.body[field];
      }
    }

    /*
     * Validate numeric settings
     */

    if (
      update.maxCVs !== undefined
    ) {
      update.maxCVs = Number(
        update.maxCVs
      );

      if (
        !Number.isFinite(
          update.maxCVs
        ) ||
        update.maxCVs < 0
      ) {
        return res.status(400).json({
          message:
            'Invalid max CV value',
        });
      }
    }

    if (
      update.maxAIRequests !==
      undefined
    ) {
      update.maxAIRequests =
        Number(
          update.maxAIRequests
        );

      if (
        !Number.isFinite(
          update.maxAIRequests
        ) ||
        update.maxAIRequests < 0
      ) {
        return res.status(400).json({
          message:
            'Invalid max AI requests value',
        });
      }
    }

    if (
      Object.keys(update).length === 0
    ) {
      return res.status(400).json({
        message:
          'No settings provided',
      });
    }

    /*
     * Validate default template
     */

    if (update.defaultTemplate) {
      const template =
        await Template.findOne({
          slug:
            update.defaultTemplate,
        });

      if (!template) {
        return res.status(400).json({
          message:
            'Default template does not exist',
        });
      }
    }

    const settings =
      await SystemSettings.findOneAndUpdate(
        {
          key: 'global',
        },
        {
          $set: update,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      );

    await log(
      req,
      'update_settings',
      'SystemSettings',
      settings._id.toString(),
      'Updated platform settings'
    );

    return res.json({
      settings,
    });
  } catch (error) {
    console.error(
      'Update settings error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to update system settings',
    });
  }
}