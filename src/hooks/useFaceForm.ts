import { useForm } from "@mantine/form";
import { useEffect } from "react";

import type { FaceForm } from "../types";

export const useFaceForm = () => {
  const form = useForm<FaceForm>({
    initialValues: {
      image: null,
      imageUrl: "",
      minConfidence: 0.5,
      blurRatio: 0.007,
    },
  });

  useEffect(() => {
    (async () => {
      await new Promise(() => {
        if (!form.values.image) {
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(form.values.image);
        reader.onload = () => {
          if (!reader.result || reader.result instanceof ArrayBuffer) {
            return;
          }

          form.setFieldValue("imageUrl", reader.result);
        };
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.image]);

  return {
    form,
  };
};
