import {assert} from 'chai';
import {delay, retry} from '../../lib/Promise';

describe('retry', function() {
	it('succeeds early on success', async function() {
		let errCount = 0;
		const incErr = () => { errCount++; };
		const f = async function() {
			return 1;
		};
		const result = await retry(f, 3, incErr);
		assert.equal(result, 1);
		assert.equal(errCount, 0);
	});

	it('succeeds on single-run success', async function() {
		let errCount = 0;
		const incErr = () => { errCount++; };
		const f = async function() {
			return 1;
		};
		const result = await retry(f, 1, incErr);
		assert.equal(result, 1);
		assert.equal(errCount, 0);
	});

	it('fails on single-run failure', async function() {
		let errCount = 0;
		let finalErr: Error|undefined;
		const incErr = () => { errCount++; };
		const f = async function() {
			throw new Error(':(');
		};
		try {
			await retry(f, 1, incErr);
		} catch ( err ) {
			finalErr = err;
		}
		assert.equal(finalErr.message, ':(');
		assert.equal(errCount, 0);
	});

	it('succeeds early on success after failure', async function() {
		let errCount = 0;
		const incErr = () => { errCount++; };
		let ranOnce = false;
		const f = async function() {
			if ( !ranOnce ) {
				ranOnce = true;
				throw new Error(':(');
			}
			return 1;
		};
		const result = await retry(f, 3, incErr);
		assert.equal(result, 1);
		assert.equal(errCount, 1);
	});

	it('fails on continued failure', async function() {
		let errCount = 0;
		let finalErr: Error|undefined;
		const incErr = () => { errCount++; };
		const f = async function() {
			throw new Error(':(');
		};
		try {
			await retry(f, 3, incErr);
		} catch ( err ) {
			finalErr = err;
		}
		assert.equal(finalErr.message, ':(');
		assert.equal(errCount, 2);
	});
});