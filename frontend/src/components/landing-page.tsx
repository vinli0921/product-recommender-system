import { PageSection, Title, Spinner, Alert } from '@patternfly/react-core';
import { GalleryView } from './Gallery';
import { useRecommendations } from '../hooks';

export function LandingPage() {
  const { data, isLoading, isError } = useRecommendations();

  if (isLoading) {
    return (
      <PageSection>
        <Spinner size="lg" />
      </PageSection>
    );
  }

  if (isError) {
    return (
      <PageSection>
        <Alert variant="danger" title="Error">
          Failed to fetch recommendations. Please try again later.
        </Alert>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel={'h1'} style={{ marginTop: '15px' }}>
          Product Recommendations
        </Title>
      </PageSection>
      <GalleryView products={data || []} />
    </>
  );
}
