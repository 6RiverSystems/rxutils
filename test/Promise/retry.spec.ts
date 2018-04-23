import {assert} from 'chai';
import {delay, retry} from '../../lib/Promise';

describe('retry', function() {
	async function getOutcomeForFunction(f: () => Promise<number>, retries: number = 3) {
		let errCount = 0;
		let finalErr: Error|undefined;
		let result: number|undefined;
		const incErr = () => { errCount++; };
		try {
			result = await retry(f, retries, incErr);
		} catch ( err ) {
			finalErr = err;
		}
		return {result, finalErr, errCount};
	}

	it('succeeds early on success', async function() {
		const {result, finalErr, errCount} = await getOutcomeForFunction(async function() {
			return 1;
		});
		assert.equal(result, 1);
		assert.equal(errCount, 0);
	});

	it('succeeds on single-run success', async function() {
		const {result, finalErr, errCount} = await getOutcomeForFunction(async function() {
			return 1;
		}, 1);
		assert.equal(result, 1);
		assert.equal(errCount, 0);
	});

	it('fails on single-run failure', async function() {
		const {result, finalErr, errCount} = await getOutcomeForFunction(async function() {
			throw new Error(':(');
		}, 1);
		assert.equal(finalErr.message, ':(');
		assert.equal(errCount, 0);
	});

	it('succeeds early on success after failure', async function() {
		let ranOnce = false;
		const {result, finalErr, errCount} = await getOutcomeForFunction(async function() {
			if ( !ranOnce ) {
				ranOnce = true;
				throw new Error(':(');
			}
			return 1;
		});
		assert.equal(result, 1);
		assert.equal(errCount, 1);
	});

	it('fails on continued failure', async function() {
		const {result, finalErr, errCount} = await getOutcomeForFunction(async function() {
			throw new Error(':(');
		});
		assert.equal(finalErr.message, ':(');
		assert.equal(errCount, 2);
	});
});