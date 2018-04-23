/**
 * Returns a promise that succeeds after a given number of milliseconds
 *
 * @param {number} timeMs: How long to wait before succeeding
 * @method delay
 */
export function delay(timeMs: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeMs);
	});
}