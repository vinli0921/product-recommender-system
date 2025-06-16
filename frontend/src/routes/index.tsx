import { Page, PageSection } from '@patternfly/react-core';
import { createFileRoute } from '@tanstack/react-router';
import { Masthead } from '../components/masthead';
import { App } from '../components/App';

export const Route = createFileRoute('/')({
  component: Recommendations,
});

const pageId = 'primary-app-container';

function Recommendations() {
  return (
    <Page mainContainerId={pageId} masthead={<Masthead />}>
      <PageSection hasBodyWrapper={false}>
        <App />
      </PageSection>
    </Page>
  );
}
