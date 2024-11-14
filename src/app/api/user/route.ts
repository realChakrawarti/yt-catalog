import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";

import { createUserDocument, TWELEVE_HOURS } from "./models";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const message = await createUserDocument(requestBody.uid);

  const response = NxResponse.success<any>(message, {}, 201);

  response.cookies.set("userId", requestBody.uid, {
    maxAge: TWELEVE_HOURS,
    path: "/",
  });

  return response;
}
