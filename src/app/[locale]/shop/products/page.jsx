import ShopProductList from "@/features/shop/product/shopProductList"
import SidebarProductList from "@/features/shop/product/sidebarProductList"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 md:flex-shrink-0 mb-6 md:mb-0">
          <SidebarProductList />
        </div>
        <div className="flex-grow">
          <ShopProductList />
        </div>
      </div>
    </div>
  )
}
