import { ChangeEvent, useLayoutEffect, useState } from "react";

import { TitleDescriptionSchema } from "~/shared/types-schema/schemas";
import { TitleDescriptionType } from "~/shared/types-schema/types";

const initialState = {
  title: "",
  description: "",
};

export function useMetaValidate({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  useLayoutEffect(() => {
    if (!title || !description) {
      return;
    }
    setMeta({
      title,
      description,
    });

    return () => {
      setMeta(initialState);
      setMetaError(initialState);
    };
  }, [title, description]);

  const [meta, setMeta] = useState<TitleDescriptionType>(initialState);

  const [metaError, setMetaError] =
    useState<TitleDescriptionType>(initialState);

  function resetState() {
    setMeta(initialState);
    setMetaError(initialState);
  }

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setMeta((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    const parseMeta = {
      ...meta,
      [e.target.name]: e.target.value,
    };

    const result = TitleDescriptionSchema.safeParse(parseMeta);

    if (!result.success) {
      const { title = { _errors: [""] }, description = { _errors: [""] } } =
        result.error.format();
      setMetaError({
        title: title._errors[0],
        description: description._errors[0],
      });
    } else {
      setMetaError({
        title: "",
        description: "",
      });
    }
  }

  const submitDisabled =
    metaError.title ||
    metaError.description ||
    !meta.title ||
    !meta.description;

  return { handleOnChange, meta, metaError, resetState, submitDisabled };
}
