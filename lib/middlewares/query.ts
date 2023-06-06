import type { SortType } from "./sort";
import type { OrderType } from "./order";

const queryMiddleware = (
  params: { query: string; sort?: SortType; order?: OrderType },
  body: URLSearchParams,
  url: URL
) => url.searchParams.append("nm", params.query);

export default queryMiddleware;
