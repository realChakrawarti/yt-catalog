import { z } from "zod";

import { TitleDescriptionSchema } from "./schemas";

export type TitleDescriptionType = z.infer<typeof TitleDescriptionSchema>;