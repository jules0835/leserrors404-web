import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductSkeleton() {
  return (
    <div className="w-full pb-10 px-10">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
        <div className="w-full mx-auto px-8 mt-12">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {[...Array(4)].map((_, i) => (
                <CarouselItem key={i} className="pl-4 basis-full md:basis-1/4">
                  <Card className="border-none shadow-lg rounded-2xl">
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                      <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                      <div className="w-3/4 h-6 bg-gray-200 rounded mt-4"></div>
                      <div className="w-full h-4 bg-gray-200 rounded mt-2"></div>
                      <div className="w-1/2 h-8 bg-gray-200 rounded mt-4"></div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-between mt-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  )
}
