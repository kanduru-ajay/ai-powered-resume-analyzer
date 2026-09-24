import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis',
    required: true
  },
  skill: { type: String, required: true },
  whyRequired: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  topics: [{ type: String }],
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' }
}, { timestamps: true });

const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
