// In-Memory Data Store fallback when MongoDB is not running locally

class MemoryStore {
  constructor() {
    this.users = [];
    this.resumes = [];
    this.jobDescriptions = [];
    this.analyses = [];
    this.conversations = [];
    this.messages = [];
    this.recommendations = [];
    this.interviewSessions = [];
    this.isMongoDBConnected = false;
  }

  setConnected(status) {
    this.isMongoDBConnected = status;
  }

  // User Operations
  async findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id) {
    const u = this.users.find(u => String(u._id || u.id) === String(id));
    if (!u) return null;
    return { ...u, select: () => u };
  }

  async createUser(userData) {
    const user = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  // Resume Operations
  async createResume(data) {
    const resume = {
      _id: `resume_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.resumes.push(resume);
    return resume;
  }

  async getResumesByUser(userId) {
    return this.resumes.filter(r => String(r.user) === String(userId)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getResumeById(id) {
    return this.resumes.find(r => String(r._id) === String(id)) || null;
  }

  async deleteResume(id) {
    this.resumes = this.resumes.filter(r => String(r._id) !== String(id));
    return true;
  }

  // JobDescription Operations
  async createJD(data) {
    const jd = {
      _id: `jd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.jobDescriptions.push(jd);
    return jd;
  }

  async getJDsByUser(userId) {
    return this.jobDescriptions.filter(j => String(j.user) === String(userId)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getJDById(id) {
    return this.jobDescriptions.find(j => String(j._id) === String(id)) || null;
  }

  // Analysis Operations
  async createAnalysis(data) {
    const analysis = {
      _id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.analyses.push(analysis);
    return analysis;
  }

  async getAnalysesByUser(userId) {
    const list = this.analyses.filter(a => String(a.user) === String(userId));
    // Populate resume and jobDescription
    return list.map(a => this.populateAnalysis(a)).sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
  }

  async getAnalysisById(id) {
    const a = this.analyses.find(item => String(item._id) === String(id));
    if (!a) return null;
    return this.populateAnalysis(a);
  }

  async getAnalysesByIds(ids) {
    return this.analyses.filter(a => ids.includes(String(a._id))).map(a => this.populateAnalysis(a));
  }

  populateAnalysis(analysis) {
    const resumeObj = typeof analysis.resume === 'object' ? analysis.resume : this.resumes.find(r => String(r._id) === String(analysis.resume));
    const jdObj = typeof analysis.jobDescription === 'object' ? analysis.jobDescription : this.jobDescriptions.find(j => String(j._id) === String(analysis.jobDescription));
    return {
      ...analysis,
      resume: resumeObj || analysis.resume,
      jobDescription: jdObj || analysis.jobDescription
    };
  }

  // Chat Operations
  async getConversationById(id) {
    return this.conversations.find(c => String(c._id) === String(id)) || null;
  }

  async getLatestConversation(userId) {
    const userConvs = this.conversations.filter(c => String(c.user) === String(userId));
    return userConvs.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))[0] || null;
  }

  async createConversation(data) {
    const conv = {
      _id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      save: async function() { return this; }
    };
    this.conversations.push(conv);
    return conv;
  }

  async createChatMessage(data) {
    const msg = {
      _id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.messages.push(msg);
    return msg;
  }

  async getMessagesByConversation(convId) {
    return this.messages.filter(m => String(m.conversation) === String(convId)).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async clearUserChatHistory(userId) {
    const userConvs = this.conversations.filter(c => String(c.user) === String(userId)).map(c => String(c._id));
    this.messages = this.messages.filter(m => !userConvs.includes(String(m.conversation)));
    this.conversations = this.conversations.filter(c => String(c.user) !== String(userId));
    return true;
  }

  // Recommendation & Interview Session
  async createInterviewSession(data) {
    const session = {
      _id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.interviewSessions.push(session);
    return session;
  }
}

export const memoryStore = new MemoryStore();
