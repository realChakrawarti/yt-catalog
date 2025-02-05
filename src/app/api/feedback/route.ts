import { NextRequest } from "next/server";

import { createGitHubIssue } from "~/entities/feedback/services/create-github-issue";
import { NxResponse } from "~/utils/nx-response";

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
