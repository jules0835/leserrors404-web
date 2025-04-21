export default function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow-lg text-center">
          <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
          <div className="w-3/4 h-6 bg-gray-200 rounded mt-4 mx-auto"></div>
          <div className="w-full h-4 bg-gray-200 rounded mt-2"></div>
          <div className="w-1/2 h-8 bg-gray-200 rounded mt-8 mx-auto"></div>
        </div>
      ))}
    </div>
  )
}
