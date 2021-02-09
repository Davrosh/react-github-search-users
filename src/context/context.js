import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);

  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState({ show: false, msg: "" });

  const checkRequests = React.useCallback(() => {
    axios(`${rootUrl}/rate_limit`)
      .catch((e) => {
        console.log(e);
      })
      .then((data) => {
        const { remaining } = data.data.rate;
        setRequests((old) => remaining);
        if (remaining === 0) {
          toggleError(true, "You have exceeded your hourly rate limit!");
        }
      });
  }, []);

  const searchGithubUser = React.useCallback(async (user) => {
    setIsLoading(true);
    toggleError();

    try {
      const promise1 = axios(`${rootUrl}/users/${user}`);
      const promise2 = axios(`${rootUrl}/users/${user}/followers`);
      const promise3 = axios(`${rootUrl}/users/${user}/repos?per_page=100`);

      const [res1, res2, res3] = await Promise.all([
        promise1,
        promise2,
        promise3,
      ]);
      // console.log(res1, res2, res3);

      setGithubUser(res1.data);
      setFollowers(res2.data);
      setRepos(res3.data);
    } catch (err) {
      console.log(err);
      toggleError(true, "No such user!");

    }
    checkRequests();
    setIsLoading(false);
  },[checkRequests]);

  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  useEffect(checkRequests, [githubUser]);

  useEffect(() => {
    searchGithubUser("ausi");
  }, [searchGithubUser]);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        isLoading,
        error,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
