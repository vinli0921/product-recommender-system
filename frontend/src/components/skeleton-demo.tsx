import { PageSection, Title, Button, Flex, FlexItem } from '@patternfly/react-core';
import { useState } from 'react';
import { GallerySkeleton } from './gallery-skeleton';
import { GalleryView } from './Gallery';
// Note: faker-products was removed

export function SkeletonDemo() {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(8);

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const changeCount = () => {
    setCount(count === 8 ? 12 : 8);
  };

  const products: any[] = []; // Placeholder for demo

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel={'h1'} style={{ marginTop: '15px' }}>
        Gallery Skeleton Demo
      </Title>

      <Flex style={{ marginBottom: '1rem', gap: '1rem' }}>
        <FlexItem>
          <Button onClick={toggleLoading}>
            {isLoading ? 'Show Real Gallery' : 'Show Skeleton'}
          </Button>
        </FlexItem>
        <FlexItem>
          <Button onClick={changeCount}>Change Count ({count})</Button>
        </FlexItem>
      </Flex>

      {isLoading ? <GallerySkeleton count={count} /> : <GalleryView products={products} />}
    </PageSection>
  );
}
