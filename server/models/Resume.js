import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, required: true }, // pdf, doc, docx
  textContent: { type: String, required: true },
  parsedData: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    summary: { type: String, default: '' },
    skills: [{ type: String }],
    education: [{ type: String }],
    experience: [{ type: String }],
    projects: [{ type: String }],
    certifications: [{ type: String }],
    technologies: [{ type: String }],
    achievements: [{ type: String }],
    keywords: [{ type: String }]
  }
}, { timestamps: true });

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
export default Resume;
