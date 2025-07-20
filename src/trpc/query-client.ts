
import {
    defaultShouldDehydrateQuery,
    QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';
export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                /* staleTime define karta hai ki data kitni der tak "fresh" rahega
            Jab tak data fresh hai, React Query cache se serve karta hai without network request
            Jab data stale ho jata hai, tab background mein refetch karta hai
            */
                staleTime: 30 * 1000,
            },
            dehydrate: {
                // serializeData: superjson.serialize,
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
            },
            hydrate: {
                 deserializeData: superjson.deserialize,
            },
        },
    });
}


//!            ------------------------------ Rate Limit-----------------------------------------------

// Ek user/IP kitne requests kar sakta hai per minute/hour/day - ye control karta hai
// DDoS attacks aur API abuse se bachne ke liye use hota hai (DDos :-)
// Real Life Example :- Login attempts ko limit karna, email sending ko control karna, expensive API calls ko restrict karna.