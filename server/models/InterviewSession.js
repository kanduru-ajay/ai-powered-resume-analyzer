import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysis: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis', default: null },
  jobTitle: { type: String, default: 'General Role' },
  questions: [
    {
      category: { type: String, enum: ['Technical', 'HR', 'Project', 'Skill Gap', 'Role Alignment'], default: 'Technical' },
      question: { type: String, required: true },
      sampleAnswer: { type: String, default: '' },
      keyPoints: [{ type: String }]
    }
  ]
}, { timestamps: true });

const InterviewSession = mongoose.models.InterviewSession || mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
