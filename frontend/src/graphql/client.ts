import { HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

const httpLink = new HttpLink({
    uri: '/graphql',
})
const authLink = new SetContextLink(({ headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});