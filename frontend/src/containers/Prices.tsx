import React from "react";
import { GridList, GridListTile } from "@material-ui/core";
import PriceCard from "./PriceCard";

function Prices() {
  const streamingSites = () => {
    return [
      { siteTitle: "Netfix", sitePrice: 9.99 },
      { siteTitle: "Hulu", sitePrice: 9.99 },
      { siteTitle: "Disney+", sitePrice: 14.99 },
      { siteTitle: "YouTube", sitePrice: 14.99 },
      { siteTitle: "Apple", sitePrice: 17.99 },
    ];
  };

  return (
    <GridList
      cellHeight={"auto"}
      style={{ height: "50%", width: "100%", margin: "0%" }}
      cols={1}
      spacing={0}
    >
      {}
      {streamingSites().map((s: any, i: number) => (
        <GridListTile cols={1} rows={1}>
          <PriceCard
            streamingTitle={s.siteTitle}
            streamingPrice={s.sitePrice}
          />
        </GridListTile>
      ))}
    </GridList>
  );
}

export default Prices;
