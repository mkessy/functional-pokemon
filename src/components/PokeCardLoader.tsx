import { useSafeFetch } from "../hooks/useSafeFetch";
import { useEffect } from "react";
import { PokemonDecoder } from "../utils/decoders";
import { PokemonResource, Pokemon } from "../types";
import { safeFetch, safeFetchAndDecode } from "../utils/safeFetch";
import { renderNone, renderLoading, renderError } from "./utility";
import { PokeCardGrid } from "./PokeCardGrid";

import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as D from "io-ts/Decoder";
import * as O from "fp-ts/Option";
import * as RO from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/lib/function";

type PokeCardProps = { pokeResourceList: PokemonResource };

function PokeCardLoader({ pokeResourceList: { results } }: PokeCardProps) {
  const [matchPokemon, fetchPokemon] = useSafeFetch<
    string,
    ReadonlyArray<Pokemon>
  >();

  useEffect(() => {
    pipe(
      results,
      RO.map((result) =>
        safeFetchAndDecode<Pokemon>(result.url, PokemonDecoder)
      ),
      TE.sequenceArray,
      fetchPokemon
    );
  }, [fetchPokemon, results]);

  return (
    <div>
      {matchPokemon(
        () => renderNone(),
        () => renderLoading(),
        (error, isLoading) => renderError(error),
        (pokemons, isLoading) => PokeCardGrid({ pokemons })
      )}
    </div>
  );
}

export default PokeCardLoader;
