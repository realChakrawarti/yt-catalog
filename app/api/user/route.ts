import { db } from "@/app/lib/firebase";
import { NxResponse } from "@/app/lib/nx-response";
import { COLLECTION } from "@/app/lib/server-helper";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextRequest } from "next/server";

/**
 * This function creates a user document in the firestore when user signs up
 * for the first time.
 * @param uid
 * @returns
 */
// TODO: Batch firebase calls so its atomic in nature
const createUserDocument = async (uid: string): Promise<string> => {
  const userRef = doc(db, COLLECTION.users, uid);
  const userSnap = await getDoc(userRef);

  // Check if the user document already exists
  if (!userSnap.exists()) {
    // If the document doesn't exist, create it
    await setDoc(userRef, {
      createdAt: new Date(),
    });

    return "User created successfully";
  }

  return "User loggedIn successfully";
};

const TWELEVE_HOURS = 12 * 60 * 60; // In seconds

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
