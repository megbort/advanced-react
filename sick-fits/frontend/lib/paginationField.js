import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      // Asks the read function for the items
      // We can either...
      // Return the items because they are already in the cache
      // Or.. return false from here (network request)
      const { skip, first } = args;

      // Read number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If there are items and there aren't enough items for the requested amount and we are on the last page, just send
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // We don't have items - go to network to fetch
        return false;
      }

      // If there are items return them from the cache and we don't need to fo to the network

      if (items.length) {
        // There are items in the cache - sending to apollo
        return items;
      }

      return false; // Fallback to network
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // Runs when the Apollo Client comes back from the network with our products
      // Merging items from the network
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }

      return merged;
    },
  };
}
