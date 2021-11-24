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
  const [currentPage, setCurrentPage] = useState<number>(0); // pages are 0 indexed by the paginator(?)
  const [countPerPage, setCountPerPage] = useState<number>(20); // pages are 0 indexed by the paginator(?)
  const [currentPageUrl, setCurrentPageUrl] = useState<O.Option<string>>(
    O.some(POKE_ENDPOINT)
  ); // pages are 0 indexed by the paginator(?)
  // pages are 0 indexed by the paginator(?)

  const [matchPokeResource, fetchPokeResource] = useSafeFetch<
    string,
    PokemonResource
  >();

  const [pokeResource, setCurrentResource] = useState<
    O.Option<PokemonResource>
  >(O.none);

  const paginator = makePaginator({
    limit: 20,
    totalCount: 1118,
    makePageUrl: makePokeUrl,
  });

  useEffect(() => {
    // fetch the poke resources
    pipe(
      currentPageUrl,
      O.fold(
        () => setCurrentResource(O.none),
        (url) =>
          fetchPokeResource(
            safeFetchAndDecode<PokemonResource>(url, PokemonResourceDecoder)
          )
      )
    );
  }, [currentPageUrl, fetchPokeResource]);

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
      <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100">
        Primary
      </button>
      <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100">
        Change per page count
      </button>
    </div>
  );
}

export default App;
