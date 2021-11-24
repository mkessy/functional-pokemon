import * as D from "io-ts/Decoder";
import { Pokemon, PokemonResourceDecoder } from "./utils/decoders";

export type Pokemon = D.TypeOf<typeof Pokemon>;

export type PokemonResource = D.TypeOf<typeof PokemonResourceDecoder>;
