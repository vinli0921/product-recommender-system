import { PageSection, Title, Spinner, Alert } from '@patternfly/react-core';
import { useQuery } from '@tanstack/react-query';
import { GalleryView } from './Gallery';
import { fetchRecommendations } from '../services/products';

export function LandingPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
  });

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
