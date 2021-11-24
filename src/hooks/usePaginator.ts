import { makePaginator, PaginatorDependencies } from "../utils/paginator";
import { useState, useCallback } from "react";
import * as O from "fp-ts/Option";

export const usePaginator = (deps: PaginatorDependencies) => {
  const [countPerPage, setCountPerPage] = useState<number>(deps.limit);
  const [pageUrlValue, setPageUrlValue] = useState<O.Option<string>>(O.none);

  const paginator = makePaginator(deps);

  const setPageUrl = useCallback(
    (pageNum: number) => {
      const pageUrl = paginator(countPerPage)(pageNum);
      setPageUrlValue(pageUrl);
    },
    [countPerPage, setPageUrlValue, paginator]
  );

  const paginate = useCallback<B>(
    (onPaginate: (cpp: number, pageNum: number) => B) => {
      onPaginate(countPerPage);
    }
  );

  //need 'as const' this or destructuring type inference will be ambigious
  return [pageUrlValue, setCountPerPage, setPageUrl] as const;
};
