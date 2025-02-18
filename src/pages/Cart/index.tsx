import { Products } from "../../components/Products";

import { Review } from "../../components/Review";

export function Cart() {
  return (
    <div className="flex max-w-[1440px] mx-auto max-md:flex-col">
      <Products />
      <Review />
    </div>
  );
}