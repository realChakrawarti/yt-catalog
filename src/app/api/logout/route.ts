import { NxResponse } from "~/shared/lib/nx-response";

export function GET(_request: Request) {
  const response = NxResponse.success<any>(
    "User logged out successfully.",
    {},
    200
  );

  response.cookies.delete({ name: "userId", path: "/" });
  return response;
}
