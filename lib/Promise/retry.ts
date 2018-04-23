// tslint:disable-next-line:no-empty
export async function retry<T>(f: () => Promise<T>, count: number, handleError: (err: any) => void = (err: any) => {}) {
	for ( let i = 0 ; i < count - 1 ; i++ ) {
		try {
			return await f();
		} catch ( err ) {
			handleError(err);
		}
	}
	// Last run without exception swallowing,
	// so if it fails it fails.
	return await f();
}