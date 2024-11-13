"use client";

import {
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/navigation";
import fetchApi from "../../utils/fetch";
import { toast } from "../../components/custom/Toast";

type UserContext = {
  user: User | null;
  loading: boolean;
  authenticateWith: (
    provider: GoogleAuthProvider | GithubAuthProvider
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<UserContext>({
  user: null,
  loading: true,
  authenticateWith: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const [userState, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const authStateChanged = async (user: User | null) => {
    const token = await user?.getIdToken();
    if (user && token) {
      setUserState(user);
      setLoading(false);
    } else {
      setUserState(null);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    const unsubscribeFromAuth = onAuthStateChanged(auth, authStateChanged);

    return () => {
      unsubscribeFromAuth();
      setUserState(null);
    };
  }, []);

  async function authenticateWith(
    provider: GoogleAuthProvider | GithubAuthProvider
  ) {
    try {
      setLoading(true);
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      if (user) {
        const result = await fetchApi("/user", {
          method: "POST",
          body: JSON.stringify({ uid: user.uid }),
        });
        toast(result.message);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(JSON.stringify(err));
      setLoading(false);
    }
  }

  const logout = async () => {
    signOut(auth);
    window.localStorage.clear();
    const result = await fetchApi("/logout");
    toast(result.message);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user: userState, loading, authenticateWith, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
