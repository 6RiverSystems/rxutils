import * as backoff from '../lib/backoff';
import * as retry from '../lib/retry';
import * as R from 'ramda';
import * as Rx from 'rxjs';
import * as Promise from 'bluebird';
import {assert} from 'chai';
import * as Chance from 'chance';

const chance = new Chance();

describe('backoff', () => {
	const source = Rx.Observable.throw(new Error('noooooo'));

	it('linear', () => {
		const retries = chance.natural({min: 2, max: 5});
		const factor = chance.natural({min: 1, max: 20});
		const retry$ = source
			.retryWhen((error$) => {
					return retry.maxAttempts(retries, error$)
						.concatMap(backoff.linear(factor));
				}
			);

		return new Promise((resolve, reject) => {
			const start = new Date();

			retry$.subscribe(
				() => null,
				() => {
					const delta = new Date().getTime() - start.getTime();
					const expected = R.reduce<number, number>(R.add, 0, R.map(R.multiply(factor), R.range(1, retries)));

					assert.isAbove(delta, expected);
					resolve();
				},
				() => reject(new Error('Stream is not supposed to finish cleanly'))
			);
		});
	});

	it('exponential', () => {
		const retries = chance.natural({min: 2, max: 5});
		const base = chance.natural({min: 1, max: 5});
		const retry$ = source
			.retryWhen((error$) => {
				return retry.maxAttempts(retries, error$)
					.concatMap(backoff.exponential(base));
			});

		return new Promise((resolve, reject) => {
			const start = new Date();

			retry$.subscribe(
				() => null,
				() => {
					const delta = new Date().getTime() - start.getTime();
					const expected = R.reduce<number, number>(R.add, 0, R.map(R.curry(Math.pow)(base), R.range(1, retries)));

					assert.isAbove(delta, expected);
					resolve();
				},
				() => reject(new Error('Stream is not supposed to finish cleanly'))
			);
		});
	});
});
