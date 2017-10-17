import * as Rx from 'rxjs';
import * as R from 'ramda';

/**
 * Returns an Observable that waits for a period of time and then resubscribes to the
 * source observable. The amount of time increases by factor after each error.
 *
 * @param {number} factor: the amount of time to increase delay by
 * @param {number} input: the number of factors to increase delay by
 * @return {Observable} an Observable that emits after a delay
 * @method linear
 */
export const linear = R.curry((factor: number, input: number) => {
	return Rx.Observable.timer(factor * input);
});

/**
 * Returns an Observable that waits for a period of time and then resubscribes to the
 * source observable. The amount of time increases exponentially by the given base
 *
 * @param {number} base: the base for calculating the amount of delay time to increase by
 * @param {Observable} input: the exponent for calculating the amount of delay time to increase by
 * @return {Observable} an Observable that emits after a delay
 * @method exponential
 */
export const exponential = R.curry((base: number, input: number) => {
	return Rx.Observable.timer(Math.pow(base, input));
});
