import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

import { createArchive, getArchiveByUser } from "./models";

export async function GET() {
    const userId = getUserIdCookie();
    const data = await getArchiveByUser(userId);
    return NxResponse.success("Archive data fetched successfully.", data, 200);
  }

export async function POST(request: NextRequest) {
  const userId = getUserIdCookie();

  const archiveMeta = await request.json();

  const archiveId = await createArchive(userId, archiveMeta);

  return NxResponse.success<{ archiveId: string }>(
    "Archive created successfully.",
    { archiveId },
    201
  );
}
