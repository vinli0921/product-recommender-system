import { Skeleton, Title } from '@patternfly/react-core';
import { GalleryView } from './Gallery';
import { usePersonalizedRecommendations } from '../hooks/useRecommendations';

export function SearchPage() {
  const { data, isError, isLoading } = usePersonalizedRecommendations();

  return (
    <div>
      <Title headingLevel={'h1'} style={{ paddingBottom: 20 }}>
        Search
      </Title>
      {isLoading ? (
        <Skeleton style={{ height: 200 }} />
      ) : isError ? (
        <div>Error fetching products</div>
      ) : (
        <GalleryView products={data ?? []} />
      )}
    </div>
  );
}
