import React from "react";
import { Pokemon } from "../types";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as D from "io-ts/Decoder";
import * as O from "fp-ts/Option";
import * as RO from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/lib/function";

type PokeCardGridProps = { pokemons: ReadonlyArray<Pokemon> };
export const PokeCardGrid = ({ pokemons }: PokeCardGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {pipe(pokemons, RO.map(PokeCard))}
    </div>
  );
};

export default PokeCardGrid;

type PokeCardProps = { pokemon: Pokemon };

const PokeCard = (pokemon: Pokemon) => {
  console.log(pokemon);
  return (
    <article key={pokemon.id} className="overflow-hidden rounded-lg shadow-lg">
      <img
        alt={pokemon.name}
        src={pokemon.sprites.other["official-artwork"].front_default}
      />
      <a className="no-underline hover:underline text-black" href={"/"}>
        {pokemon.name + " " + pokemon.id}
      </a>
    </article>
  );
};
