/** Rough reading time in minutes from raw text (markdown is fine). */
export function readingTime(text: string | undefined | null): number {
	const words = (text ?? '').trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}
