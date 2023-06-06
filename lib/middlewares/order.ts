import { ValidationError } from "../errors";
import type { SortType } from "./sort";

const orderMapping = {
  asc: "1",
  desc: "2",
};

export type OrderType = keyof typeof orderMapping;

const orderMiddleware = (
  params: { query?: string; sort?: SortType; order?: OrderType },
  body: URLSearchParams
) => {
  if (!params.order) return;

  if (!params.sort)
    throw new ValidationError(`Sort should also be defined when order is set`);

  if (!Object.prototype.hasOwnProperty.call(orderMapping, params.order)) {
    const validOrderFields = Object.keys(orderMapping);
    throw new ValidationError(
      `Invalid order property "${
        params.order
      }". Valid properties are ${validOrderFields.join(", ")}`
    );
  }

  body.append("s", orderMapping[params.order as keyof typeof orderMapping]);
};

export default orderMiddleware;
