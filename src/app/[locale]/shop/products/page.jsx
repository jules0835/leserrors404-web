import ShopProductList from "@/features/shop/product/shopProductList"
import SidebarProductList from "@/features/shop/product/sidebarProductList"

export default function ProductsPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 mt-10">
      <div className="w-full md:w-64 md:flex-shrink-0 mb-6 md:mb-0">
        <div className="md:sticky md:top-20">
          <SidebarProductList />
        </div>
      </div>
      <div className="flex-grow">
        <ShopProductList />
      </div>
    </div>
  )
}
