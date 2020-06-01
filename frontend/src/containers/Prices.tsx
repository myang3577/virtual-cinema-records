import React from "react";
import { GridList, GridListTile } from "@material-ui/core";
import PriceCard from "./PriceCard";
import netflixlogo from "../images/netflixlogo.jpeg";
import hululogo from "../images/hululogo.jpeg";
import disneypluslogo from "../images/disneypluslogo.jpeg";
import youtubelogo from "../images/youtubelogo.jpeg";
import amazonlogo from "../images/amazonlogo.jpeg";
import applelogo from "../images/applelogo.jpeg";

function Prices() {
  const displayPrices = () => {
    const sites = streamingSites();
    return sites.map((s: any, i: number) => (
      <GridListTile key={i}>
        <PriceCard streamingBG={s.siteBG} streamingPrice={s.sitePrice} />
      </GridListTile>
    ));
  };
  const streamingSites = () => {
    return [
      { siteTitle: "Netflix", sitePrice: 9.99, siteBG: netflixlogo },
      { siteTitle: "Hulu", sitePrice: 9.99, siteBG: hululogo },
      { siteTitle: "Disney+", sitePrice: 14.99, siteBG: disneypluslogo },
      { siteTitle: "YouTube", sitePrice: 14.99, siteBG: youtubelogo },
      { siteTitle: "Apple", sitePrice: 15.99, siteBG: applelogo },
      { siteTitle: "Prime", sitePrice: 8.99, siteBG: amazonlogo },
    ];
  };

  return (
    <GridList cellHeight={"auto"} cols={2} spacing={0}>
      {displayPrices()}
    </GridList>
  );
}

export default Prices;
