import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError, ZodTypeAny, z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FetcherReturnTypes<T extends ZodTypeAny> =
  | {
      success: true;
      data: z.TypeOf<T>;
    }
  | { success: false; error: Error | ZodError<any> };

export async function fetcher<T extends z.ZodTypeAny>(
  url: string | Request | URL,
  init: RequestInit,
  responseValidator: T,
): Promise<FetcherReturnTypes<T>> {
  const response = await fetch(url, init)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}.`);
      }

      return res;
    })
    .catch((e) => {
      return e instanceof Error ? e : new Error(e);
    });

  if (response instanceof Error) return { success: false, error: response };

  const data = await response
    .json()
    .then((resData) => {
      const parsedData = responseValidator.parse(resData) as z.infer<T>;
      return parsedData;
    })
    .catch((e) => {
      return e instanceof Error ? e : e instanceof ZodError ? e : new Error(e);
    });

  if (data instanceof ZodError) {
    return { success: false, error: data };
  } else if (data instanceof Error) {
    return { success: false, error: data };
  }
  return { success: true, data };
}
