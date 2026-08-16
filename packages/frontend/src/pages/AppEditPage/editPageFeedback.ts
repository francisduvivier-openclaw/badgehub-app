export const AUTOSAVE_DEBOUNCE_MS = 3000;
export const AUTOSAVE_SUCCESS_MESSAGE_MS = 2000;
export const PUBLISH_MIN_SPINNER_MS = 500;
export const PUBLISH_SUCCESS_MESSAGE_MS = 1000;

export function publishedVersionMessage(
  version: string | undefined,
  revision: number
): string {
  const trimmed = version?.trim();
  if (trimmed) {
    return `Published version ${trimmed}`;
  }
  return `Published revision ${revision}`;
}

export async function waitAtLeast(
  startedAt: number,
  minMs: number
): Promise<void> {
  const remaining = minMs - (Date.now() - startedAt);
  if (remaining > 0) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, remaining);
    });
  }
}
