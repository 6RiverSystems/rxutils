import {delay} from './delay';

async function timeout(timeMs: number) {
	await delay(timeMs);
	throw new Error('Operation timed out');
}

/**
 * Returns a promise that fails after a number of milliseconds
 * if it hasn't already succeeded.
 *
 * @param {Promise<T>} promise: The promise to be waited on
 * @param {number} timeoutMs: How long to wait before failing the promise
 * @method withTimeout
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
	return Promise.race([promise, timeout(timeoutMs)]);
}