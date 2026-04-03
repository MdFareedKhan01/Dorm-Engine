export function calculatePersonalityDistance(studentA = {}, studentB = {}) {
  const answersA = studentA.personalityAnswers || [];
  const answersB = studentB.personalityAnswers || [];
  const length = Math.max(answersA.length, answersB.length);

  let distance = 0;
  for (let index = 0; index < length; index += 1) {
    const left = Number(answersA[index] ?? 0);
    const right = Number(answersB[index] ?? 0);
    distance += Math.abs(left - right);
  }

  return distance;
}

export function calculatePreferenceScore(studentA = {}, studentB = {}) {
  const preferencesA = studentA.preferences || {};
  const preferencesB = studentB.preferences || {};
  const keys = new Set([...Object.keys(preferencesA), ...Object.keys(preferencesB)]);

  let score = 0;
  keys.forEach((key) => {
    if (preferencesA[key] === preferencesB[key]) {
      score += 1;
    }
  });

  return score;
}

export function buildPersonalityType(answers = []) {
  const pairs = [
    ['E', 'I'],
    ['S', 'N'],
    ['T', 'F'],
    ['J', 'P'],
  ];

  return pairs
    .map(([left, right], index) => {
      const score = Number(answers[index * 4] || 0) + Number(answers[index * 4 + 1] || 0) + Number(answers[index * 4 + 2] || 0) + Number(answers[index * 4 + 3] || 0);
      return score >= 8 ? right : left;
    })
    .join('');
}

export function pickBestMatch(student, candidates = []) {
  const ranked = candidates
    .filter((candidate) => String(candidate._id) !== String(student._id))
    .map((candidate) => {
      const personalityDistance = calculatePersonalityDistance(student, candidate);
      const preferenceScore = calculatePreferenceScore(student, candidate);
      const compatibility = Math.max(0, 100 - personalityDistance * 4 + preferenceScore * 4);

      return {
        student: candidate,
        personalityDistance,
        preferenceScore,
        compatibility,
      };
    })
    .sort((left, right) => {
      if (left.personalityDistance !== right.personalityDistance) {
        return left.personalityDistance - right.personalityDistance;
      }
      return right.preferenceScore - left.preferenceScore;
    });

  return ranked[0] || null;
}
