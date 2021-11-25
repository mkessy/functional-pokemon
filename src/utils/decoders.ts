import * as D from "io-ts/Decoder";

export const PokemonDecoder = D.struct({
  id: D.number,
  name: D.string,
  height: D.number,
  weight: D.number,
});

export const PokemonResourceResult = D.struct({
  name: D.string,
  url: D.string,
});

export const PokemonResourceDecoder = D.struct({
  count: D.number,
  results: D.array(PokemonResourceResult),
});
