import ShopProductList from "@/features/shop/product/shopProductList"
import SidebarProductList from "@/features/shop/product/sidebarProductList"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0">
          <SidebarProductList />
        </div>
        <div className="flex-grow">
          <ShopProductList />
        </div>
      </div>
    </div>
  )
}
