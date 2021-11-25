import * as D from "io-ts/Decoder";

export const PokemonDecoder = D.struct({
  id: D.number,
  name: D.string,
  height: D.number,
  weight: D.number,
  is_default: D.boolean,
  sprites: D.struct({
    back_default: D.nullable(D.string),
    back_female: D.nullable(D.string),
    back_shiny: D.nullable(D.string),
    back_shiny_female: D.nullable(D.string),
    front_default: D.nullable(D.string),
    front_female: D.nullable(D.string),
    front_shiny: D.nullable(D.string),
    front_shiny_female: D.nullable(D.string),
    other: D.struct({
      "official-artwork": D.struct({
        front_default: D.string,
      }),
    }),
  }),
  stats: D.struct({
    base_state: D.number,
    effort: D.number,
    stat: D.struct({
      name: D.string,
      url: D.string,
    }),
  }),
});

export const PokemonResourceResult = D.struct({
  name: D.string,
  url: D.string,
});

export const PokemonResourceDecoder = D.struct({
  count: D.number,
  results: D.array(PokemonResourceResult),
});
