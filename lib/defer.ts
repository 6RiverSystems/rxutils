import * as Rx from 'rxjs';
import * as R from 'ramda';

declare type Logger = {error: (data: any, msg: string) => any};

/**
 * Returns an observable that will swallow (and optionally log) all errors thrown by a handler
 * and return either an empty Observable when an error occurs or the result of the handler
 *
 * @param {Logger} log: (optional) a logger to log any errors
 * @param {Function} handler: a function that is called and any errors thrown are safely swallowed
 * @return {Observable} an empty Observable when an error is thrown by the handler, otherwise
 * 							 the result of the handler function
 * @method safe
 */
export const safe = R.curry((log: Logger, handler: () => any) => {
	return Rx.Observable.defer(handler)
		.catch((err: Error, result: any) => {
			if (log && log.error) {
				log.error({err, result}, 'caught error, continuing');
			}

			return Rx.Observable.empty();
		});
});
