import type { Contract } from '@/server/api/contracts';
import type { AppRoute, ClientInferRequest } from '@ts-rest/core';

export const getQueryKey = <K extends keyof Contract, M extends keyof Contract[K]>(
  path: K,
  method: M
) => {
  return <P extends Contract[K][M] extends AppRoute ? Contract[K][M] : AppRoute>(
    params: Omit<ClientInferRequest<P>, 'cache' | 'extraHeaders' | 'headers'>
  ) => {
    return [path, method, params] satisfies [K, M, typeof params];
  };
};
