/**
 * Uses a provided promise-factory to attempt an action multiple times, resolving
 * if any of those attempts resolves, then failing if none do.
 *
 * @param {() => Promise<T>)} f: The promise-factory to retry
 * @param {number} count: How many times to retry
 * @return {(err: any) => void} handleError: An optional function to call with swallowed errors
 * @method retry
 */
// tslint:disable-next-line:no-empty
export async function retry<T>(f: () => Promise<T>, count: number, handleError: (err: any) => void = (err: any) => {}) {
	for (let i = 0 ; i < count - 1 ; i++) {
		try {
			return await f();
		} catch (err) {
			handleError(err);
		}
	}
	// Last run without exception swallowing,
	// so if it fails it fails.
	return await f();
}