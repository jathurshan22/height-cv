import User from '../models/User.js';
import CV from '../models/CV.js';
import ATSAnalysis from '../models/ATSAnalysis.js';
import Template from '../models/Template.js';

export async function homeStats(req, res) {
  try {
    const [users, cvs, ats, selectedTemplates] = await Promise.all([
      User.countDocuments(),
      CV.countDocuments(),
      ATSAnalysis.aggregate([
        { $match: { score: { $gte: 0 } } },
        { $group: { _id: null, average: { $avg: '$score' } } },
      ]),
      Template.countDocuments({ isActive: true }),
    ]);

    const averageATS = ats[0]?.average;
    return res.json({
      stats: {
        users,
        cvs,
        atsScore: Number.isFinite(averageATS) ? Math.round(averageATS) : null,
        totalTemplates: selectedTemplates,
      },
    });
  } catch (error) {
    console.error('Home stats error:', error);
    return res.status(500).json({ message: 'Failed to load Home statistics' });
  }
}
