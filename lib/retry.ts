import * as R from 'ramda';
import * as Rx from 'rxjs';

/**
 * Returns an Observable that resubscribes to the source observable each time it emits
 * an error until a limit (max) is reached and then emits that error
 *
 * @param {number} max: the number of errors to allow before emitting an error
 * @param {Observable} error$: an Observable that is re-subscribed to on error up to the limit
 * @return {Observable} an Observable of the number of retries
 * @method maxAttempts
 */
export const maxAttempts = R.curry((max: number, error$: Rx.Observable<any>) => {
		return error$.scan(function (errorCount: number, err: Error) {
			if (errorCount >= max - 1) {
				throw err;
			}
			return errorCount + 1;
		}, 0);
	}
);

/**
 * Returns an observable that resubscribes to the source observable each time it emits
 * an error
 *
 * @param {Observable} error$: an Observable that is re-subscribed to on error
 * @return {Observable} an Observable of the number of retries
 * @method forever
 */
export const forever = (error$: Rx.Observable<any>) => {
	return error$.scan((errorCount: number) => {
		return errorCount + 1;
	}, 0);
};

/**
 * Returns an observable that never resubscribes to the source observable
 *
 * @param {Observable} error$: an Observable that is never re-subscribed to on error
 * @return {Observable} an Observable of any error that was thrown by the source observable
 * @method forever
 */
export const never = (error$: Rx.Observable<any>) => {
	return error$.map((err: Error) => {
		throw err;
	});
};

/**
 * Typeof retry Observables
 */
export interface RetryPolicy {
	(errors: Rx.Observable<any>): Rx.Observable<number>;
}
