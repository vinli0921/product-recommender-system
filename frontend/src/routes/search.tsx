import { Page, PageSection } from '@patternfly/react-core';
import { createFileRoute } from '@tanstack/react-router';
import { Masthead } from '../components/masthead';
import { SearchResultsPage } from '../components/search-results-page';

export const Route = createFileRoute('/search')({
  component: Search,
  validateSearch: (search: Record<string, unknown>) => ({
    q: search.q as string,
  }),
});

function Search() {
  const { q } = Route.useSearch();

  return (
    <Page masthead={<Masthead />}>
      <PageSection hasBodyWrapper={false}>
        <SearchResultsPage query={q} />
      </PageSection>
    </Page>
  );
}
