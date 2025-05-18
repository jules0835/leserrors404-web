
import * as Yup from "yup"

export const getCategorieSchema = (t) =>
    Yup.object().shape({
        label: Yup.string().required(t("labelRequired")),
        description: Yup.string().required(t("descriptionRequired")),
        picture: Yup.string().required(t("pictureRequired")),
    })