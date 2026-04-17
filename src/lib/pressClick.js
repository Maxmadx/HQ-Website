/**
 * Fire-and-forget press link click tracker.
 * Increments the clicks counter on the press_links Firestore document.
 * Never throws — must never break site navigation.
 */
export async function trackPressClick(id) {
  try {
    await fetch('/api/press-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  } catch {
    // Silently swallow — analytics must never block navigation
  }
}
