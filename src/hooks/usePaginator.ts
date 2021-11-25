import { makePaginator, PaginatorDependencies } from "../utils/paginator";
import { useState, useCallback } from "react";
import * as O from "fp-ts/Option";

export const usePaginator = (deps: PaginatorDependencies, initUrl?: string) => {
  const paginator = makePaginator(deps);

  //need 'as const' this or destructuring type inference will be ambigious
  return [paginator] as const;
};
