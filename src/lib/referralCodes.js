// Visually unambiguous alphabet — no I, O, 0, 1 — to reduce read-aloud errors
// (codes are typically captured from URLs, but we keep the alphabet readable
// in case they ever surface in support workflows).
export const REFERRAL_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;

function pickChar(rand) {
  return REFERRAL_CODE_ALPHABET[Math.floor(rand() * REFERRAL_CODE_ALPHABET.length)];
}

export function generateReferralCode(rand = Math.random) {
  let out = '';
  for (let i = 0; i < CODE_LENGTH; i++) out += pickChar(rand);
  return out;
}
