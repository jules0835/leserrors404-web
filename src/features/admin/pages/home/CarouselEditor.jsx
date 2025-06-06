/* eslint-disable max-lines */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-lines-per-function */
"use client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { webAppSettings, emptyCarouselPart } from "@/assets/options/config"
import { useTranslations, useLocale } from "next-intl"
import CarouselPartEditor from "@/features/admin/pages/home/CarouselPartEditor"
import CarouselSkeletonEditor from "@/features/admin/pages/home/CarouselSkeletonEditor"
import { useState } from "react"
import SettingsToolbar from "@/features/settings/SettingsToolbar"
import toast from "react-hot-toast"

export default function CarouselEditor() {
  const [carousel, setCarousel] = useState(null)
  const t = useTranslations("Admin.SalesFront.HomePage")
  const locale = useLocale()
  const { isLoading, error } = useQuery({
    queryKey: ["carousel"],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/salesfront/pages/home?name=${webAppSettings.salesfront.homepage.carouselId}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch carousel")
      }

      const carouselData = await response.json()
      setCarousel(carouselData)

      return carouselData
    },
  })
  const saveCarousel = async (updatedCarousel) => {
    const response = await fetch(
      `/api/admin/salesfront/pages/home?name=${webAppSettings.salesfront.homepage.carouselId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCarousel),
      }
    )

    if (!response.ok) {
      throw new Error("Failed to update carousel")
    }

    return response.json()
  }
  const addNewPartMutation = useMutation({
    mutationFn: (newPart) => {
      const updatedCarousel = {
        ...carousel,
        carouselParts: [...carousel.carouselParts, newPart],
      }

      return toast.promise(saveCarousel(updatedCarousel), {
        loading: t("Carousel.saving"),
        success: t("Carousel.saved"),
        error: t("Carousel.error"),
      })
    },
    onSuccess: (data) => {
      setCarousel(data || carousel)
    },
  })
  const addNewPart = () => {
    addNewPartMutation.mutate(emptyCarouselPart)
  }
  const changeIsActive = () => {
    const updatedCarousel = {
      ...carousel,
      isActive: !carousel.isActive,
    }

    toast.promise(
      saveCarousel(updatedCarousel).then((data) => {
        setCarousel(data || updatedCarousel)
      }),
      {
        loading: t("Carousel.saving"),
        success: t("Carousel.saved"),
        error: t("Carousel.error"),
      }
    )
  }
  const updatePart = (updatedPart) => {
    const updatedCarousel = {
      ...carousel,
      carouselParts: carousel.carouselParts
        .map((part) => (part._id === updatedPart._id ? updatedPart : part))
        .filter((part) => !part.isDeleted),
    }

    toast.promise(
      saveCarousel(updatedCarousel).then((data) => {
        setCarousel(data || updatedCarousel)
      }),
      {
        loading: t("Carousel.saving"),
        success: t("Carousel.saved"),
        error: t("Carousel.error"),
      }
    )
  }
  const updatePartPosition = (position, part) => {
    const currentIndex = carousel.carouselParts.findIndex(
      (p) => p._id === part._id
    )
    let newIndex = currentIndex

    if (position === "up" && currentIndex > 0) {
      newIndex = currentIndex - 1
    } else if (
      position === "down" &&
      currentIndex < carousel.carouselParts.length - 1
    ) {
      newIndex = currentIndex + 1
    }

    if (newIndex !== currentIndex) {
      const updatedParts = [...carousel.carouselParts]
      const [movedPart] = updatedParts.splice(currentIndex, 1)
      updatedParts.splice(newIndex, 0, movedPart)

      const updatedCarousel = {
        ...carousel,
        carouselParts: updatedParts.map((p, index) => ({
          ...p,
          position: index,
        })),
      }

      toast.promise(
        saveCarousel(updatedCarousel).then((data) => {
          setCarousel(data || updatedCarousel)
        }),
        {
          loading: t("Carousel.saving"),
          success: t("Carousel.saved"),
          error: t("Carousel.error"),
        }
      )
    }
  }

  return (
    <div className="p-4 md:p-5 border border-gray-200 rounded-md">
      {error && <div>Error: {error.message}</div>}
      {!isLoading && (
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 md:space-x-2">
          <SettingsToolbar
            addAction={addNewPart}
            desactivationAction={changeIsActive}
            activationAction={changeIsActive}
            isActive={carousel?.isActive || false}
          />
          <h3 className="text-center md:text-left">
            {t("Carousel.isActualState")}{" "}
            <span
              className={`${
                carousel?.isActive ? "text-green-500" : "text-orange-500"
              } font-semibold`}
            >
              {carousel?.isActive
                ? t("Carousel.active")
                : t("Carousel.inactive")}
            </span>
          </h3>
        </div>
      )}
      {carousel && !isLoading && (
        <div className="grid grid-cols-1 gap-4 mt-5">
          {carousel?.carouselParts?.map((part) => (
            <CarouselPartEditor
              key={part.partId}
              part={part}
              updatePart={updatePart}
              locale={locale}
              updatePartPosition={updatePartPosition}
            />
          ))}
        </div>
      )}
      {(isLoading || addNewPartMutation.isPending) && (
        <CarouselSkeletonEditor />
      )}
      {carousel &&
        !isLoading &&
        (carousel?.carouselParts?.length === 0 || !carousel?.carouselParts) && (
          <div className="mt-5">
            <h3 className="text-center text-gray-500">{t("Carousel.empty")}</h3>
          </div>
        )}
    </div>
  )
}
