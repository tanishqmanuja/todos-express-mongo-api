import { isNativeError } from "util/types";

/* Type Definitions */
export type ResultOk<T> = {
  ok: true;
  value: T;
};
export type ResultError<E extends Error = Error> = {
  ok: false;
  error: E;
};
export type Result<T, E extends Error = Error> = ResultOk<T> | ResultError<E>;

/* Type Assertions */
export function isResult(result: unknown): result is Result<unknown> {
  return (
    result !== null &&
    typeof result === "object" &&
    "ok" in result &&
    typeof result.ok === "boolean" &&
    ("error" in result || "value" in result)
  );
}

export function isResultOk<T>(result: Result<T>): result is ResultOk<T> {
  return result.ok;
}

export function isResultError<E extends Error = Error>(
  result: Result<unknown, E>,
): result is ResultError<E> {
  return !result.ok;
}

/* Data Types Wrappers */
export function resultOk<T>(value: T): ResultOk<T> {
  return {
    ok: true,
    value,
  };
}

export function resultError<E extends Error = Error>(e: E): ResultError<E> {
  return {
    ok: false,
    error: e,
  };
}

/* Data Types Creation Functions */
export function computeResult<T>(
  lazypromise: () => Promise<T>,
): Promise<Result<T, Error>>;

export function computeResult<T>(
  lazypromiselike: () => PromiseLike<T>,
): PromiseLike<Result<T, Error>>;

export function computeResult<T>(lazytask: () => T): Result<T, Error>;

/**
 * @description Wrap a lazy promise or task in a result type
 * @type Result is { ok: true, value: T } or { ok: false, error: E }
 */
export function computeResult<T>(
  fn: () => T | PromiseLike<T>,
): Result<T, Error> | PromiseLike<Result<T, Error>> {
  try {
    const value = fn();

    if (isPromiseLike(value)) {
      return value.then(
        v => resultOk(v),
        e => resultError(ensureError(e)),
      );
    }

    return resultOk(value);
  } catch (err) {
    const error = ensureError(err);
    return resultError(error);
  }
}

/* Utils */
export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}

export function ensureError(error: unknown): Error {
  if (isNativeError(error)) {
    return error;
  }
  return new Error(String(error), { cause: error });
}
