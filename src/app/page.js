"use client";
import { useState, useEffect } from "react";
import { LoginDialog } from "./_components/logindialog";
import { Xtream, XTREAM_CONFIG_KEY, XTREAM_PRELOADED } from "@/lib/xtream";
import { xtreamClient, xtreamValues } from "./global";
import { toast } from "sonner";
import {
  AuthenticatinError,
  AccountDisabledError,
  FetchError,
} from "@/lib/errors";
import MainNav from "./_components/mainnav";
import LoadingSpinner from "./_components/loadingspinner";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [isLoadingPlaylist, setIsLoadingPlayist] = useState(false);

  useEffect(() => {
    const checkExistingLogin = async () => {
      const conf = localStorage.getItem(XTREAM_CONFIG_KEY);
      if (conf) {
        try {
          xtreamClient.setConfig(JSON.parse(conf));
          await xtreamClient.getAccountInfo();
          setIsLoggedIn(true);
          setDialogOpen(false);
          setIsLoadingPlayist(true);
          const preloaded = localStorage.getItem(XTREAM_PRELOADED);
          if (preloaded) {
            xtreamValues.loadFromJson(JSON.parse(preloaded));
          } else {
            await xtreamValues.setValuesXtreamClient(xtreamClient);
            localStorage.setItem(
              XTREAM_PRELOADED,
              JSON.stringify(xtreamValues.dump()),
            );
          }
          setIsLoadingPlayist(false);
        } catch (error) {
          console.error("Error checking existing login:", error);
          setIsLoggedIn(false);
          setIsLoadingPlayist(false);
        }
      }
    };

    checkExistingLogin();
  }, []);

  const handleLogin = async (username, password, url) => {
    try {
      xtreamClient.setConfig({
        baseUrl: url,
        auth: {
          username: username,
          password: password,
        },
      });
      await xtreamClient.getAccountInfo();
      setIsLoggedIn(true);
      setDialogOpen(false);
      setIsLoadingPlayist(true);
      localStorage.setItem(
        XTREAM_CONFIG_KEY,
        JSON.stringify(xtreamClient.getConfig()),
      );
      await xtreamValues.setValuesXtreamClient(xtreamClient);
      localStorage.setItem(
        XTREAM_PRELOADED,
        JSON.stringify(xtreamValues.dump()),
      );
      setIsLoadingPlayist(false);
    } catch (error) {
      setIsLoadingPlayist(false);
      var description = "Could not login";
      if (error instanceof FetchError) {
        description = "could not connect to given url";
      } else if (error instanceof AccountDisabledError) {
        description = "account disabled!";
      } else if (error instanceof AuthenticatinError) {
        description = "check your username and password";
        // Handle account disabled error
      }
      console.error("Login error:", error);
      toast.warning("Login Error", {
        description: description,
      });
      // Handle login error (e.g., show an error message to the user)
    }
  };

  if (isLoadingPlaylist) {
    return (
      <LoadingSpinner
        description={"Loading playlist this can take a while..."}
      />
    );
  }

  if (isLoggedIn) {
    return <MainNav />;
  }

  return (
    <LoginDialog
      onLogin={handleLogin}
      isDialogOpen={isDialogOpen}
      setDialogOpen={setDialogOpen}
    />
  );
}
