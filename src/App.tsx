import React from "react";
import "./App.css";
import { safeFetchAndDecode } from "./utils/safeFetch";
import { useEffect, useCallback, useState } from "react";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { Pokemon, PokemonResource } from "./types";
import { PokemonResourceDecoder } from "./utils/decoders";
import { makePaginator } from "./utils/paginator";
import { usePaginator } from "./hooks/usePaginator";
import { useSafeFetch } from "./hooks/useSafeFetch";
import { renderNone, renderLoading, renderError } from "./components/utility";
import PokeCardLoader from "./components/PokeCardLoader";
import Pagination from "./components/Pagination";
import { pipe } from "fp-ts/lib/function";

const POKE_ENDPOINT = "https://pokeapi.co/api/v2/pokemon";
const makePokeUrl = (count: number, offset: number) =>
  `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${count}`;

function App() {
  const [paginator] = usePaginator({
    limit: 20,
    totalCount: 1118,
    makePageUrl: makePokeUrl,
  });
  const [currentPage, setPage] = useState<number>(0);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageUrl, setPageUrl] = useState<O.Option<string>>(O.of(POKE_ENDPOINT));
  const [pageUrls, setPageUrls] = useState<ReadonlyArray<O.Option<string>>>(
    paginator(20)[0]
  );

  const changePagination = useCallback(
    (countPerPage: number) => {
      const [pageUrls, numPages] = paginator(countPerPage);
      setPageUrl(pageUrls[currentPage]);
      setPageUrls(pageUrls);
      setNumPages(numPages);
    },
    [paginator, currentPage]
  );

  const changePage = useCallback(
    (pageNum: number) => {
      setPageUrl(pageUrls[pageNum]);
      setPage(pageNum);
    },
    [pageUrls]
  );

  const [matchPokeResource, fetchPokeResource] = useSafeFetch<
    string,
    PokemonResource
  >();

  const [pokeResource, setCurrentResource] = useState<
    O.Option<PokemonResource>
  >(O.none);

  useEffect(() => {
    // fetch the poke resources
    pipe(
      pageUrl,
      O.fold(
        () => setCurrentResource(O.none),
        (url) =>
          fetchPokeResource(
            safeFetchAndDecode<PokemonResource>(url, PokemonResourceDecoder)
          )
      )
    );
  }, [fetchPokeResource, pageUrl]);

  return (
    <div>
      <h1 className="text-center text-lg text-blue-400 mt-10">
        Functional Poke
      </h1>
      <div className="container mx-auto mt-4">
        {matchPokeResource(
          () => renderNone(),
          () => renderLoading(),
          (e) => renderError(e),
          (pokeResource, isLoading) => (
            <PokeCardLoader pokeResourceList={pokeResource} />
          )
        )}
        <Pagination
          pageUrls={pageUrls}
          handleChangePage={changePage}
          currPage={currentPage}
        />
        <button onClick={() => changePagination(10)}>Change pagination</button>
      </div>
    </div>
  );
}

export default App;
