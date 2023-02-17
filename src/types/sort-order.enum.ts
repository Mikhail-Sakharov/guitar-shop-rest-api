export enum SortOrder {
  Down = -1,
  Up = 1,
}

export enum ClientSortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export enum SortType {
  Price = 'price',
  Rating = 'rating'
}

export const SortOrderMap = {
  [ClientSortOrder.Asc]: SortOrder.Up,
  [ClientSortOrder.Desc]: SortOrder.Down
};
