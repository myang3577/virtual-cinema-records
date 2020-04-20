import React from "react";
import { useSelector } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";

function About() {
  const movieSearchResult: any = useSelector<GlobalState>(
    (state) => state.otherData.movieSearchResult
  );

  return (
    <div>
      {movieSearchResult.results
        ? movieSearchResult.results.map((e: any, index: number) => (
            <div key={index}>{e.title + ": " + e.vote_average}</div>
          ))
        : "no movie search data"}
    </div>
  );
}

export default About;
