import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as D from "io-ts/Decoder";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";
import axios from "axios";
import { useState, useCallback } from "react";

export function useSafeFetch<E, A>() {
  const [value, setValue] = useState<O.Option<E.Either<E, A>>>(O.none);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runFetchTask = useCallback((fetchTaskE: TE.TaskEither<E, A>) => {
    const fetchTask = pipe(
      TE.fromIO<void, E>(() => setIsLoading(true)), //IO since its async but guaranteed to succeed
      TE.chain(() => fetchTaskE),
      TE.chainFirst(() => TE.fromIO(() => setIsLoading(false)))
    );

    fetchTask().then((fetchResultEither) =>
      pipe(fetchResultEither, O.some, setValue)
    );
  }, []);

  const match = useCallback(
    <B, C, D, F>(
      onNone: () => B,
      onLoading: () => C,
      onError: (error: E, isLoading: boolean) => D,
      onSuccess: (value: A, isLoading: boolean) => F
    ) =>
      pipe(
        value,
        O.matchW(
          () => (isLoading ? onLoading() : onNone()),
          E.matchW(
            (e) => onError(e, isLoading),
            (a) => onSuccess(a, isLoading)
          )
        )
      ),
    [value, isLoading]
  );

  return [match, runFetchTask] as const;
}
