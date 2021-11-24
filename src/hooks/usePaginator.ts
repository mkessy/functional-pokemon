import { makePaginator, PaginatorDependencies } from "../utils/paginator";
import { useState } from "react";

export const usePaginator = (deps: PaginatorDependencies) => {
  const paginator = makePaginator(deps);

  return paginator;
};
