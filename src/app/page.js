"use client";
import {
    AccountDisabledError,
    AuthenticatinError,
    FetchError,
} from "@/lib/errors";
import { XTREAM_CONFIG_KEY, XTREAM_PRELOADED } from "@/lib/xtream";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "./_components/loadingspinner";
import { LoginCard } from "./_components/logincard";
import MainNav from "./_components/mainnav";
import { xtreamClient, xtreamValues } from "./global";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingPlaylist, setIsLoadingPlayist] = useState(false);

  useEffect(() => {
    const checkExistingLogin = async () => {
      const conf = localStorage.getItem(XTREAM_CONFIG_KEY);
      if (conf) {
        try {
          xtreamClient.setConfig(JSON.parse(conf));
          await xtreamClient.getAccountInfo();
          setIsLoggedIn(true);
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
          setIsLoggedIn(false);
          setIsLoadingPlayist(false);
        }
      }
    };

    checkExistingLogin();
  }, []);

  const handleLoadXtream = async () => {
    try {
      setIsLoadingPlayist(true);
      await xtreamValues.setValuesXtreamClient(xtreamClient);
      localStorage.setItem(
        XTREAM_PRELOADED,
        JSON.stringify(xtreamValues.dump()),
      );
    } catch (error) {
      errorHandler(error, "Playlist load error:");
    } finally {
      setIsLoadingPlayist(false);
    }
  };

  const errorHandler = (error, warnString = "Login error:") => {
    var description = "Could not login";
    if (error instanceof FetchError) {
      description = "could not connect to given url";
    } else if (error instanceof AccountDisabledError) {
      description = "account disabled!";
    } else if (error instanceof AuthenticatinError) {
      description = "check your username and password";
      // Handle account disabled error
    }
    console.error(warnString, error);
    toast.warning(warnString, {
      description: description,
    });
  };

  const handleNewPlaylist = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(XTREAM_PRELOADED);
    localStorage.removeItem(XTREAM_CONFIG_KEY);
  };

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
      localStorage.setItem(
        XTREAM_CONFIG_KEY,
        JSON.stringify(xtreamClient.getConfig()),
      );
      await handleLoadXtream();
    } catch (error) {
      errorHandler(error);
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
    return (
      <MainNav
        handleLoadXtream={handleLoadXtream}
        handleNewPlaylist={handleNewPlaylist}
      />
    );
  }

  return <LoginCard onLogin={handleLogin} />;
}
