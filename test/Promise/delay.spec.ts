import {assert} from 'chai';
import {delay} from '../../lib/Promise';

describe('delay', function() {
	describe ('it waits approximately the right amount', async function() {
		const before = new Date();
		await delay(1000);
		const after = new Date();
		const diff = after.getTime() - before.getTime();
		assert.isAtLeast(diff, 1000);
		assert.isAtMost(diff, 1500);
	});
});