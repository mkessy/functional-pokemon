import * as D from "io-ts/Decoder";
import { PokemonDecoder, PokemonResourceDecoder } from "./utils/decoders";

export type Pokemon = D.TypeOf<typeof PokemonDecoder>;

export type PokemonResource = D.TypeOf<typeof PokemonResourceDecoder>;
