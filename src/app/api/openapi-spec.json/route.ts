import { NextResponse } from "next/server";

import openApiSpecification from "./openapi-spec.json" with {type: "json"};

export function GET() {
    return NextResponse.json(openApiSpecification)
}