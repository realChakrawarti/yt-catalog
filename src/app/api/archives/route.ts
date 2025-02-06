import { NextRequest } from "next/server";

import { createArchive } from "~/entities/archives/services/create-archive";
import { getArchiveByUser } from "~/entities/archives/services/get-archives-by-user";
import { NxResponse } from "~/shared/lib/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

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
