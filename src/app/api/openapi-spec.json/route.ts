import { NextResponse } from "next/server";

import specJson from "./openapi.json" with {type: "json"};

export function GET() {
    return NextResponse.json(specJson)
}