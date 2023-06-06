import { ValidationError } from "../errors";
import { OrderType } from "./order";

const sortMapping = {
  registered: "1",
  title: "2",
  downloads: "4",
  size: "7",
  lastMessage: "8",
  seeds: "10",
  leeches: "11",
};

export type SortType = keyof typeof sortMapping;

const sortMiddleware = (
  params: { query?: string; sort?: SortType; order?: OrderType },
  body: URLSearchParams
) => {
  if (!params.sort) {
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(sortMapping, params.sort)) {
    const validSortFields = Object.keys(sortMapping);
    throw new ValidationError(
      `Invalid sort property "${
        params.sort
      }". Valid properties are ${validSortFields.join(", ")}`
    );
  }

  body.append("o", sortMapping[params.sort]);
};

export default sortMiddleware;
