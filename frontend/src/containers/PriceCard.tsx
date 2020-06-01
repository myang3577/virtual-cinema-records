import React from "react";
import { Card, CardHeader } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export interface PriceCardProps {
  streamingPrice: number;
  streamingBG: string;
}

function PriceCard(props: PriceCardProps) {
  const clickSite = (event: any) => {
    //open site
  };

  return (
    <Card
      style={{
        height: "auto",
        width: "90%",
        margin: "5px",
        marginLeft: "5%",
        marginRight: "5%",
        backgroundImage: "url(" + props.streamingBG + ")",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <CardHeader
        titleTypographyProps={{
          variant: "subtitle1",
          style: {
            marginTop: "-10%",
            color: "white",
            textShadow:
              "0px 0px 8px rgba(0, 0, 0, 1),0px 0px 8px rgba(0, 0, 0, 1),0px 0px 8px rgba(0, 0, 0, 1),0px 0px 8px rgba(0, 0, 0, 1),0px 0px 8px rgba(0, 0, 0, 1),0px 0px 8px rgba(0, 0, 0, 1)",
          },
          paragraph: true,
        }}
        title={"$" + props.streamingPrice}
        style={{ height: "auto", margin: "5%" }}
      />
    </Card>
  );
}

export default PriceCard;
