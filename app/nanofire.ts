import { DataSnapshot, Query, onValue } from "firebase/database";
import { ReadableAtom, atom, onMount } from "nanostores";

const cache = new Map<string, ReadableAtom>();

export { cache as unstable_nanofireStoreCache };

function getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {
  if (map.has(key)) {
    return map.get(key)!;
  }
  const value = create();
  map.set(key, value);
  return value;
}

/**
 * Represents the result of an observable query.
 */
export type ObservableResult<T> = {
  data?: T;
  status: "loading" | "error" | "success";
  error?: Error;
};

/**
 * Obtains a store that represents the result of a Firebase Realtime Database query.
 * @param query - The query to observe.
 * @returns A store that represents the result of the query.
 */
export function getFirebaseDatabaseQueryStore(
  query: Query
): ReadableAtom<ObservableResult<DataSnapshot>> {
  return getOrCreate(cache, query.toString(), () => {
    const store = atom<ObservableResult<DataSnapshot>>({ status: "loading" });
    onMount(store, () => {
      return onValue(
        query,
        (snapshot) => {
          store.set({ status: "success", data: snapshot });
        },
        (error) => {
          store.set({ status: "error", error });
        }
      );
    });
    return store;
  });
}

export function mapObservableResult<T, U>(
  result: ObservableResult<T>,
  map: (data: T) => U
): ObservableResult<U> {
  return "data" in result
    ? { ...result, data: map(result.data!) }
    : (result as ObservableResult<unknown> as ObservableResult<U>);
}
