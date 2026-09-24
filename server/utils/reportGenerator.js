export const generateReportContent = (analysis) => {
  const candidateName = analysis.resume?.parsedData?.name || analysis.resume?.originalName || 'Candidate';
  const jobTitle = analysis.jobDescription?.parsedData?.jobTitle || analysis.jobDescription?.jobTitle || 'Target Position';
  const company = analysis.jobDescription?.company || 'Target Organization';

  return `
================================================================================
                    RESUMEAI - RECRUITMENT & ATS REPORT
================================================================================
Generated Date : ${new Date(analysis.createdAt || Date.now()).toLocaleDateString()}
Candidate Name : ${candidateName}
Target Job     : ${jobTitle} (${company})
Report ID      : ${analysis._id}

--------------------------------------------------------------------------------
1. OVERALL ATS SCORE & ALIGNMENT SUMMARY
--------------------------------------------------------------------------------
Overall ATS Score         : ${analysis.atsScore} / 100
Skill Match Percentage    : ${analysis.skillMatchPercentage}%
Keyword Match Percentage  : ${analysis.keywordMatchPercentage}%
Experience Match Score    : ${analysis.experienceMatchPercentage}%
Technology Match Score    : ${analysis.technologyMatchPercentage}%
Education Match Score     : ${analysis.educationMatchPercentage}%

--------------------------------------------------------------------------------
2. SKILL GAP ANALYSIS
--------------------------------------------------------------------------------
[✓] Matched Skills:
${(analysis.matchedSkills || []).map(s => `  - ${s}`).join('\n') || '  - None'}

[✗] Missing Required Skills:
${(analysis.missingSkills || []).map(s => `  - ${s}`).join('\n') || '  - None'}

[!] Preferred Skills Gaps:
${(analysis.preferredSkillsMissing || []).map(s => `  - ${s}`).join('\n') || '  - None'}

--------------------------------------------------------------------------------
3. KEYWORD MATCH BREAKDOWN
--------------------------------------------------------------------------------
Matched Keywords:
${(analysis.matchedKeywords || []).map(k => `  - ${k}`).join('\n') || '  - None'}

Missing Job Keywords:
${(analysis.missingKeywords || []).map(k => `  - ${k}`).join('\n') || '  - None'}

--------------------------------------------------------------------------------
4. QUALITATIVE AI ANALYSIS & FEEDBACK
--------------------------------------------------------------------------------
Experience Alignment:
${analysis.experienceAnalysis || 'Candidate experience aligns with target responsibilities.'}

Education & Qualifications:
${analysis.educationAnalysis || 'Educational criteria met.'}

Strengths:
${(analysis.strengths || []).map(s => `  + ${s}`).join('\n')}

Weaknesses / Risk Areas:
${(analysis.weaknesses || []).map(w => `  - ${w}`).join('\n')}

--------------------------------------------------------------------------------
5. RESUME IMPROVEMENT SUGGESTIONS
--------------------------------------------------------------------------------
${(analysis.suggestions || []).map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

--------------------------------------------------------------------------------
6. RECOMMENDED LEARNING ROADMAP
--------------------------------------------------------------------------------
${(analysis.recommendedLearning || []).map((r, i) => `
  ${i + 1}. Skill: ${r.skill} [Priority: ${r.priority || 'High'}, Level: ${r.level || 'Intermediate'}]
     Why Required: ${r.whyRequired}
     Topics: ${(r.topics || []).join(', ')}
`).join('\n')}

================================================================================
                    END OF REPORT - RESUMEAI ASSISTANT
================================================================================
`;
};
