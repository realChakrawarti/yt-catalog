import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";

import { createGitHubIssue } from "./models";

export async function POST(request: NextRequest) {
  const { title, description } = await request.json();

  try {
    const issueUrl = await createGitHubIssue(title, description);
    return NxResponse.success(
      "Feedback shared successfully.",
      { data: issueUrl },
      201
    );
  } catch (err) {
    return NxResponse.fail(
      "Unable to share feedback.",
      {
        code: "FEEDBACK_FAILED",
        details: "Unable to share feedback.",
      },
      400
    );
  }
}
