import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as D from "io-ts/Decoder";
import { pipe } from "fp-ts/lib/function";
import axios from "axios";

const axiosGet = async <T>(url: string) => {
  return axios
    .get<T>(url, {
      validateStatus: function (status) {
        return status === 200; //tell axios to throw if the response code is anything but OK
      },
      timeout: 2000,
    })
    .then((res) => {
      console.log(res.status);
      return res.data;
    })
    .catch((reason) => {
      throw new Error(`${reason}`);
    });
};

export const safeFetch = TE.tryCatchK(axiosGet, (reason) => `${reason}`);

export const safeFetchAndDecode = <T>(
  url: string,
  decoder: D.Decoder<unknown, T>
) => {
  const task = pipe(
    safeFetch<T>(url),
    TE.chain((a) => {
      const decoded = decoder.decode(a);
      return E.isLeft(decoded)
        ? TE.left(String(decoded.left))
        : TE.right(decoded.right);
    })
  );
  return task;
};
