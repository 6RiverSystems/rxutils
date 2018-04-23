export function delay(timeMs: number) {
	return new Promise((s, j) => {
		setTimeout(s, timeMs);
	});
}