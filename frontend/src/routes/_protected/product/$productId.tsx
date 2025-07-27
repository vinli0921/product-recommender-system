import { createFileRoute } from "@tanstack/react-router";
import { Flex, PageSection } from "@patternfly/react-core";
import { ProductDetails } from "../../../components/product-details";

export const Route = createFileRoute("/_protected/product/$productId")({
  loader: async ({ params: { productId } }) => {
    return {
      productId,
    };
  },
  component: ProductComponent,
});

function ProductComponent() {
  return (
    <PageSection>
      <Flex
        justifyContent={{ default: "justifyContentSpaceBetween" }}
        alignItems={{ default: "alignItemsCenter" }}
        direction={{ default: "row" }}
        style={{ width: "100%", height: "60vh" }}
      >
        <ProductDetails />
      </Flex>
    </PageSection>
  );
}
