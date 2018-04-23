import {assert} from 'chai';
import {delay, withTimeout} from '../../lib/Promise';

describe ('timeout', function() {
	it('does not interfere with complete operations', async function() {
		const t = await withTimeout(Promise.resolve(1), 100);
		assert.equal(t, 1);
	});

	it('does not interfere with fast operations', async function() {
		const f = async () => {
			return 1;
		};

		const t = await withTimeout(f(), 100);
		assert.equal(t, 1);
	});

	it('does cancel at approximately the right time', async function() {
		const f = async () => {
			// Need a yield point so this won't spinlock the process!
			while ( true ) { await delay(100); }
		};
		let threw = false;
		await (async () => {
			try {
				await withTimeout(f(), 100);
			} catch ( err ) {
				threw = true;
			}
		})();
		assert.isTrue(threw);
	});
});