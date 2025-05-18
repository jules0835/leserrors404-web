import { useTranslations } from "next-intl"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import CarouselEditor from "@/features/admin/pages/home/CarouselEditor"
import HomeBannerEditor from "@/features/admin/pages/homeBanner/homeBannerEditor"

export default function HomePage() {
  const t = useTranslations("Admin.SalesFront.HomePage")

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h2 className="text-lg font-semibold">
              {t("Carousel.titleSection")}
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="my-5">
              <CarouselEditor />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <h2 className="text-lg font-semibold">
              {t("Banner.titleSection")}
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="my-5">
              <HomeBannerEditor />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
