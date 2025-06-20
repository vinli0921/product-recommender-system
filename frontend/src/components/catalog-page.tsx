import { PageSection, Title } from '@patternfly/react-core';
import { GalleryView } from './Gallery';
import { FakerProducts } from './faker-products';
import { fetchCatalog } from '../services/products';
import { useQuery } from '@tanstack/react-query';

export function CatalogPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['catalog'], // A unique key for this query
    queryFn: fetchCatalog, // The async function to fetch data
  });

  const products = data ? data : FakerProducts();

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel={'h1'} style={{ marginTop: '15px' }}>
          Catalog
        </Title>
        <GalleryView products={products} />
      </PageSection>
    </>
  );
}
