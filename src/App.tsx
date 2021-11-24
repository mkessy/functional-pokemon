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
import { pipe } from "fp-ts/lib/function";

const POKE_ENDPOINT = "https://pokeapi.co/api/v2/pokemon";
const makePokeUrl = (count: number, offset: number) =>
  `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${count}`;

function App() {
  const [pageUrl, setCpp, setPageUrl] = usePaginator({
    limit: 20,
    totalCount: 1118,
    makePageUrl: makePokeUrl,
  });

  const [page, setPage] = useState<number>(0);

  const changePage = (pageNum?: number, cpp?: number) => {
    if (pageNum) setPageUrl(pageNum);
    if (cpp) {
      setCpp(cpp);
      setPageUrl(page);
    }
  };

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
  }, [pageUrl, fetchPokeResource]);

  return (
    <div>
      <h1 className="text-center text-lg text-blue-400 mt-10">
        Functional Poke
      </h1>
      <ul>
        {matchPokeResource(
          () => renderNone(),
          () => renderLoading(),
          (e) => renderError(e),
          ({ count, results }, isLoading) => {
            return results.map(({ name, url }) => {
              return (
                <li key={url}>
                  <a href={url}>{name}</a>
                </li>
              );
            });
          }
        )}
      </ul>
      <button
        onClick={() => setPageUrl(8)}
        className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100"
      >
        Primary
      </button>
      <button
        onClick={() => setCpp(5)}
        className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100"
      >
        Change per page count
      </button>
    </div>
  );
}

export default App;
