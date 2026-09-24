import Analysis from '../models/Analysis.js';
import { generateCourseRecommendations } from '../services/recommendations/recommendationEngine.js';

// @desc Generate course / learning recommendations
// @route POST /api/recommendations
export const getRecommendations = async (req, res, next) => {
  try {
    const { analysisId, missingSkills, jobTitle } = req.body;

    let skills = missingSkills || [];
    let title = jobTitle || 'Target Role';

    if (analysisId) {
      const analysis = await Analysis.findById(analysisId).populate('jobDescription');
      if (analysis) {
        skills = analysis.missingSkills || [];
        title = analysis.jobDescription?.parsedData?.jobTitle || 'Target Role';

        if (analysis.recommendedLearning && analysis.recommendedLearning.length > 0) {
          return res.status(200).json({
            success: true,
            data: { recommendations: analysis.recommendedLearning }
          });
        }
      }
    }

    const recommendations = await generateCourseRecommendations(skills, title);

    return res.status(200).json({
      success: true,
      data: { recommendations }
    });
  } catch (error) {
    next(error);
  }
};
