import * as Rx from 'rxjs';

export function safeDefer(handler: () => any, log: {error: (data: any, msg: string) => any}) {
	return Rx.Observable.defer(handler)
		.catch((err: Error, result: any) => {
			if (log && log.error) {
				log.error({err, result}, 'caught error, continuing');
			}

			return Rx.Observable.empty();
		});
}
