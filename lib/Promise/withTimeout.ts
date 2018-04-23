import {delay} from './delay';

async function timeout(timeMs: number) {
	await delay(timeMs);
	throw new Error('Operation timed out');
}

export function withTimeout<T>(promise: Promise<T>, time: number) {
	return Promise.race([promise, timeout(time)]);
}