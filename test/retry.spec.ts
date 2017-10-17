import * as retry from '../lib/retry';
import * as Rx from 'rxjs';
import * as Promise from 'bluebird';

describe('retry', () => {
	const source = Rx.Observable.interval()
		.map((n) => n * 2)
		.map((n) => {
			if (n === 4) {
				throw new Error('expected');
			}
			return n;
		});

	context('maxAttempts', () => {
		[1, 2, 5].forEach((n) => {
			it(`should retry for up to ${n} attempts`, () => {
				let numAttempts = 1;

				const retry$ = source
					.retryWhen((error$) =>
						retry.maxAttempts(n, error$).do(() => numAttempts++)
					);

				return new Promise((resolve, reject) => {
					retry$.subscribe(
						() => null,
						(err) => {
							if (err.message === 'expected' && numAttempts === n) {
								resolve();
							} else {
								reject(err);
							}
						},
						() => reject(new Error('Stream is not supposed to finish cleanly'))
					);
				});
			});
		});
	});

	context('forever', () => {
		it(`should retry forever`, () => {
			let numAttempts = 1;

			const retry$ = source
				.retryWhen((error$) =>
					retry.forever(error$).map(() => numAttempts++)
				);

			return new Promise((resolve, reject) => {
				retry$.subscribe(
					() => {
						// can't literally wait forever, this should take awhile anyway
						if (numAttempts > 200) {
							resolve();
						}
					},
					reject,
					() => reject(new Error('Stream is not supposed to finish cleanly'))
				);
			});
		});
	});

	context('never', () => {
		it(`should never retry`, () => {
			let numAttempts = 1;

			const retry$ = source
				.retryWhen((error$) =>
					retry.never(error$).do(() => numAttempts++)
				);

			return new Promise((resolve, reject) => {
				retry$.subscribe(
					() => null,
					(err) => {
						if (err.message === 'expected' && numAttempts === 1) {
							resolve();
						} else {
							reject(err);
						}
					},
					() => reject(new Error('Stream is not supposed to finish cleanly'))
				);
			});
		});
	});
});
