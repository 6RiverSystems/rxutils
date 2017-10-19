import {defer} from '../dist';
import {assert} from 'chai';
import {Chance} from 'chance';
import * as Promise from 'bluebird';
import * as sinon from 'sinon';
import * as Rx from 'rxjs';
import * as R from 'ramda';

const chance = new Chance();

describe('defer', () => {
	context('safe', () => {
		it('should never fail', () => {
			const input = R.range(1, chance.natural({min: 5, max: 100}));
			const idx = chance.natural({min: 0, max: input.length - 1});

			// insert an input that will fail the handler
			input[idx] = null;

			const handler = sinon.spy((x: number) =>
				Rx.Observable.if(() => !x, Rx.Observable.throw(new Error()), Rx.Observable.of(x))
			);
			const log = {error: sinon.spy()};
			const safeDefer = defer.safe(log);
			const source = Rx.Observable.from(input)
			.concatMap((v) => safeDefer(() => handler(v)));

			return new Promise((resolve, reject) => {
				source.subscribe(() => null, reject, () => {
					assert.isTrue(log.error.calledOnce);
					assert.strictEqual(handler.callCount, input.length);
					resolve();
				});
			});
		});
	});
});
