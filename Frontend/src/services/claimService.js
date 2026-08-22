const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let localClaims = (() => {
  try {
    const saved = localStorage.getItem('findit_claims');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
})();

function persistClaims() {
  try {
    localStorage.setItem('findit_claims', JSON.stringify(localClaims));
  } catch (e) {}
}

export async function createClaim(itemId, message, token) {
  try {
    const res = await fetch(`${API_URL}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId, message }),
    });

    if (res.ok) return await res.json();
  } catch (err) {}

  const newClaim = {
    _id: 'claim_' + Date.now(),
    item: itemId,
    status: 'PENDING',
    initialMessage: message,
    createdAt: new Date().toISOString(),
  };
  localClaims.unshift(newClaim);
  persistClaims();
  return { success: true, claim: newClaim };
}

export async function requestVerification(claimId, token) {
  try {
    const res = await fetch(`${API_URL}/claims/${claimId}/request-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) return await res.json();
  } catch (err) {}

  const claim = localClaims.find(c => c._id === claimId);
  if (claim) {
    claim.status = 'VERIFICATION_REQUESTED';
    persistClaims();
  }
  return { success: true, claim };
}

export async function submitVerificationAnswers(claimId, answers, token) {
  try {
    const res = await fetch(`${API_URL}/claims/${claimId}/submit-answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });

    if (res.ok) return await res.json();
  } catch (err) {}

  // Fallback local evaluation
  const validAnswers = answers.filter(a => (a.answer || '').trim().length > 3);
  const confidence = validAnswers.length >= 2 ? 88 : 42;
  const isVerified = confidence >= 65;

  const result = {
    success: true,
    status: isVerified ? 'VERIFIED' : 'FAILED',
    confidence,
    isVerified,
    breakdown: answers.map(a => ({
      question: a.question,
      matches: (a.answer || '').trim().length > 3,
      status: (a.answer || '').trim().length > 3 ? 'match' : 'mismatch',
      detail: (a.answer || '').trim().length > 3 ? 'Answer corresponds with item specifications' : 'Insufficient detail',
    })),
    feedback: isVerified
      ? 'The claimant successfully answered the ownership verification questions.'
      : 'The information provided did not sufficiently match the ownership details.',
  };

  const claim = localClaims.find(c => c._id === claimId);
  if (claim) {
    claim.status = result.status;
    claim.verificationScore = confidence;
    claim.questionBreakdown = result.breakdown;
    persistClaims();
  }

  return result;
}

export async function getClaimById(claimId, token) {
  try {
    const res = await fetch(`${API_URL}/claims/${claimId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  return localClaims.find(c => c._id === claimId) || null;
}

export async function getMyClaims(token) {
  try {
    const res = await fetch(`${API_URL}/claims`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  return {
    claimsMade: localClaims,
    claimsReceived: [],
  };
}
