import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jobDescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription',
    required: true
  },
  atsScore: { type: Number, required: true },
  skillMatchPercentage: { type: Number, required: true },
  keywordMatchPercentage: { type: Number, required: true },
  experienceMatchPercentage: { type: Number, required: true },
  technologyMatchPercentage: { type: Number, required: true },
  educationMatchPercentage: { type: Number, required: true },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  preferredSkillsMissing: [{ type: String }],
  matchedKeywords: [{ type: String }],
  missingKeywords: [{ type: String }],
  experienceAnalysis: { type: String, default: '' },
  educationAnalysis: { type: String, default: '' },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestions: [{ type: String }],
  recommendedLearning: [
    {
      skill: String,
      whyRequired: String,
      level: String,
      topics: [String],
      priority: String
    }
  ]
}, { timestamps: true });

const Analysis = mongoose.models.Analysis || mongoose.model('Analysis', analysisSchema);
export default Analysis;
