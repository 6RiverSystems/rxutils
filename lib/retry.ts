import * as R from 'ramda';
import * as Rx from 'rxjs';

export const maxAttempts = R.curry((max: number, error$: Rx.Observable<any>) =>
	error$.scan(function (errorCount: number, err: Error) {
		if (errorCount >= max - 1) {
			throw err;
		}
		return errorCount + 1;
	}, 0)
);

export const forever = (error$: Rx.Observable<any>) => {
	return error$.scan((errorCount: number) => {
		return errorCount + 1;
	}, 0);
};

export const never = (error$: Rx.Observable<any>) => {
	return error$.map((err: Error) => {
		throw err;
	});
};

export interface RetryPolicy {
	(errors: Rx.Observable<any>): Rx.Observable<number>;
}
