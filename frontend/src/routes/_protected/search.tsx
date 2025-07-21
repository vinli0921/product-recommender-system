import { PageSection } from '@patternfly/react-core';
import { createFileRoute } from '@tanstack/react-router';
import { SearchResultsPage } from '../../components/search-results-page';

export const Route = createFileRoute('/_protected/search')({
  component: Search,
  validateSearch: (search: Record<string, unknown>) => ({
    q: search.q as string,
  }),
});

function Search() {
  const { q } = Route.useSearch();

  return (
    <PageSection hasBodyWrapper={false}>
      <SearchResultsPage query={q} />
    </PageSection>
  );
}
