import { NextRequest } from "next/server";

import { createArchive, getArchiveByUser } from "~/entities/archives";
import { getUserIdCookie } from "~/shared/lib/next/get-cookie";
import { NxResponse } from "~/shared/lib/next/nx-response";

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
