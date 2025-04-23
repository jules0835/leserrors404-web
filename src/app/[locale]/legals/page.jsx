import { useTranslations } from "next-intl"

export default function Page() {
  const t = useTranslations("legals")

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:mt-16 mt-0">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {t("definitions.title")}
        </h2>
        <div className="space-y-4">
          <p>{t("definitions.client")}</p>
          <p>{t("definitions.services")}</p>
          <p>{t("definitions.content")}</p>
          <p>{t("definitions.clientInfo")}</p>
          <p>{t("definitions.user")}</p>
          <p>{t("definitions.personalInfo")}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {t("presentation.title")}
        </h2>
        <div className="space-y-4">
          <p>{t("presentation.owner")}</p>
          <p>{t("presentation.publisher")}</p>
          <p>{t("presentation.host")}</p>
          <p>{t("presentation.dpo")}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("conditions.title")}</h2>
        <div className="space-y-4">
          <p>{t("conditions.intellectualProperty")}</p>
          <p>{t("conditions.acceptance")}</p>
          <p>{t("conditions.accessibility")}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("services.title")}</h2>
        <p>{t("services.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {t("technicalLimitations.title")}
        </h2>
        <p>{t("technicalLimitations.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {t("intellectualProperty.title")}
        </h2>
        <div className="space-y-4">
          <p>{t("intellectualProperty.rights")}</p>
          <p>{t("intellectualProperty.consequences")}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("liability.title")}</h2>
        <div className="space-y-4">
          <p>{t("liability.publisher")}</p>
          <p>{t("liability.damages")}</p>
          <p>{t("liability.interactiveSpaces")}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("privacy.title")}</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {t("privacy.dataController.title")}
          </h3>
          <p>{t("privacy.dataController.description")}</p>

          <h3 className="text-xl font-semibold">
            {t("privacy.purpose.title")}
          </h3>
          <ul className="list-disc pl-6">
            <li>{t("privacy.purpose.navigation")}</li>
            <li>{t("privacy.purpose.fraud")}</li>
            <li>{t("privacy.purpose.improvement")}</li>
            <li>{t("privacy.purpose.communication")}</li>
          </ul>

          <h3 className="text-xl font-semibold">{t("privacy.rights.title")}</h3>
          <p>{t("privacy.rights.description")}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("cookies.title")}</h2>
        <div className="space-y-4">
          <p>{t("cookies.definition")}</p>
          <p>{t("cookies.purpose")}</p>
          <p>{t("cookies.management")}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {t("applicableLaw.title")}
        </h2>
        <p>{t("applicableLaw.description")}</p>
      </section>
    </div>
  )
}
