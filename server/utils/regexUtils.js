/**
 * Safely escapes special regular expression characters in a string.
 * Prevents regex syntax errors for terms like C++, C#, .NET, Node.js, C/C++, CI/CD.
 * @param {string} value
 * @returns {string}
 */
export function escapeRegExp(value) {
  if (!value) return '';
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Safely checks if a skill or phrase matches target text without breaking on
 * special technology names such as C++, C#, .NET, Node.js, React.js, C/C++, CI/CD, AWS, etc.
 * @param {string} skill
 * @param {string} text
 * @returns {boolean}
 */
export function skillMatchesText(skill, text) {
  if (!skill || !text) return false;
  const trimmed = String(skill).trim();
  if (!trimmed) return false;

  const targetText = String(text);
  const escaped = escapeRegExp(trimmed);

  // If skill consists solely of alphanumeric characters (e.g. "React", "Python", "Docker")
  if (/^[A-Za-z0-9]+$/.test(trimmed)) {
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(targetText);
  }

  // If skill contains punctuation/special characters (e.g. "C++", "C#", ".NET", "Node.js", "C/C++", "CI/CD")
  const regex = new RegExp(escaped, 'i');
  return regex.test(targetText);
}
