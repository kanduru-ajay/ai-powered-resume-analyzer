import { findVerifiedCourse } from '../../config/courseCatalog.js';

export const generateCourseRecommendations = async (missingSkills = [], jobTitle = 'Target Role') => {
  const recommendations = [];

  // Limit to max 3 recommendations
  const targetSkills = (missingSkills && missingSkills.length > 0)
    ? missingSkills.slice(0, 3)
    : ['System Design', 'Docker', 'AWS'];

  targetSkills.forEach((skill, index) => {
    const verified = findVerifiedCourse(skill);

    if (verified) {
      recommendations.push({
        skill: verified.skill,
        courseName: verified.courseName,
        platform: verified.platform,
        url: verified.url,
        description: verified.description,
        level: verified.level,
        whyRequired: verified.whyRequired || `Essential requirement requested in the ${jobTitle} description.`,
        priority: index === 0 ? 'High' : (index === 1 ? 'Medium' : 'Low')
      });
    } else {
      // Unverified skill fallback
      recommendations.push({
        skill: skill,
        courseName: `${skill} Fundamentals & Architecture`,
        platform: 'Online Learning Platform',
        url: null, // No verified URL
        description: `Recommended training topic to master ${skill} for ${jobTitle} roles.`,
        level: 'Intermediate',
        whyRequired: `No verified course link is currently available for this skill, but mastering ${skill} is recommended for ${jobTitle}.`,
        priority: index === 0 ? 'High' : 'Medium'
      });
    }
  });

  return recommendations;
};
