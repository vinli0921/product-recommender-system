import { GalleryView } from './Gallery';
import { Title, FlexItem, Skeleton } from '@patternfly/react-core';
import { useWishlist } from '../hooks';

export function Wishlist() {
  const { data, isError, isLoading } = useWishlist();

  return (
    <FlexItem>
      <Title headingLevel={'h1'} style={{ paddingBottom: 20 }}>
        Wishlist
      </Title>
      {isLoading ? (
        <Skeleton style={{ height: 200 }} />
      ) : isError ? (
        <div>Error fetching wishlist</div>
      ) : (
        <GalleryView products={data ?? []} />
      )}
    </FlexItem>
  );
}
