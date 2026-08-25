const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function createClaim(itemId, message, token) {
  const res = await fetch(`${API_URL}/claims`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ itemId, message }),
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  throw new Error(data.message || 'Failed to submit claim');
}

export async function requestVerification(claimId, token) {
  const res = await fetch(`${API_URL}/claims/${claimId}/request-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  throw new Error(data.message || 'Failed to request verification');
}

export async function submitVerificationAnswers(claimId, answers, token) {
  const res = await fetch(`${API_URL}/claims/${claimId}/submit-answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  throw new Error(data.message || 'Failed to submit verification answers');
}

export async function approveClaim(claimId, token) {
  const res = await fetch(`${API_URL}/claims/${claimId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  throw new Error(data.message || 'Failed to approve claim');
}

export async function rejectClaim(claimId, token) {
  const res = await fetch(`${API_URL}/claims/${claimId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  throw new Error(data.message || 'Failed to reject claim');
}

export async function getClaimById(claimId, token) {
  if (!claimId) {
    return { error: 'INVALID_ID', status: 400, message: 'Invalid claim identifier' };
  }

  try {
    const res = await fetch(`${API_URL}/claims/${claimId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return data;
    }

    if (res.status === 400) {
      return { error: 'INVALID_ID', status: 400, message: data.message || 'Invalid claim identifier' };
    }
    if (res.status === 401) {
      return { error: 'UNAUTHENTICATED', status: 401, message: data.message || 'Authentication required' };
    }
    if (res.status === 403) {
      return { error: 'UNAUTHORIZED', status: 403, message: data.message || 'Not authorized to view this claim' };
    }
    if (res.status === 404) {
      return { error: 'NOT_FOUND', status: 404, message: data.message || 'Claim not found' };
    }

    return { error: 'ERROR', status: res.status, message: data.message || 'Failed to load claim' };
  } catch (err) {
    return { error: 'NETWORK_ERROR', status: 0, message: 'Network connection error' };
  }
}

export async function getMyClaims(token) {
  const res = await fetch(`${API_URL}/claims`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  throw new Error(data.message || 'Failed to retrieve claims');
}
