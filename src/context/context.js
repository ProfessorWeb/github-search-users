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
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState(0);
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    try {
      toggleError();
      setIsLoading(true);

      const res = await axios(`${rootUrl}/users/${user}`);
      if (!res.data) throw new Error("There Is No User With That Username");
      setGithubUser(res.data);

      const { login, followers_url } = res.data;

      const getRepos = await axios(
        `${rootUrl}/users/${login}/repos?per_page=100`
      );
      const getFollowers = await axios(`${followers_url}?per_page=100`);

      await Promise.allSettled([getRepos, getFollowers]).then((res) => {
        /* 
        const [team1,team2] = [['maccabi tel aviv'],['haifa']];
        console.log(team1)


        What we did here, is we simply assigned a name to the array and from there we take the desired information.

        Of course promise.all
        Handles 2 requests.
        So we assigned one name to repo and a second name to followers

         const [repo, followers] = res;



      options two handle promise.allSettled

        const promiseAll = await Promise.allSettled([getRepos, getFollowers]);
        const [repo, followers] = promiseAll;

        */

        const [repo, followers] = res;
        if (repo.status === "fulfilled") setRepos(repo.value.data);
        if (followers.status === "fulfilled")
          setFollowers(followers.value.data);
      });
    } catch (error) {
      toggleError(true, "There Is No User With That Username");
      console.error(error);
    }

    /* 
    we want run this is function all time when we call searchGithubUser
    Technically can also use a dependency list in useEffect 

    useEffect(() => {
    rate_limit();
  }, [githubUser]);
  */

    rate_limit();

    setIsLoading(false);
  };

  const rate_limit = async () => {
    try {
      const { data: request } = await axios(`${rootUrl}/rate_limit`); // object destructure

      setRequests(request.rate.remaining); // set current requests

      if (request.rate.remaining === 0) {
        // throw error
        toggleError(true, "sorry, you have exceeded your hourly rate limit!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    rate_limit();
  }, []);

  // default parameters
  const toggleError = function (show = false, msg = "") {
    setError({ show, msg });
  };

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

const useGlobalContext = () => {
  return React.useContext(GithubContext);
};

export { GithubProvider, useGlobalContext };
