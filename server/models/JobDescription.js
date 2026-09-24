import mongoose from 'mongoose';

const jobDescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: { type: String, required: true, default: 'Software Engineer' },
  company: { type: String, default: 'Tech Company' },
  rawText: { type: String, required: true },
  parsedData: {
    jobTitle: { type: String, default: 'Software Engineer' },
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    experience: { type: String, default: '0+ years' },
    education: [{ type: String }],
    responsibilities: [{ type: String }],
    technologies: [{ type: String }],
    certifications: [{ type: String }],
    keywords: [{ type: String }]
  }
}, { timestamps: true });

const JobDescription = mongoose.models.JobDescription || mongoose.model('JobDescription', jobDescriptionSchema);
export default JobDescription;
