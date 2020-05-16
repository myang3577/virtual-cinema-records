import React from "react";
import { Card, CardHeader, CardContent, Link } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export interface PriceCardProps {
  streamingTitle: string;
  streamingPrice: number;
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
      }}
    >
      <CardHeader
        titleTypographyProps={{
          variant: "subtitle1",
          display: "inline",
        }}
        title={props.streamingTitle}
        subheader={"$" + props.streamingPrice}
        style={{ height: "auto" }}
        action={<ExitToAppIcon style={{ margin: "5%" }} onClick={clickSite} />}
      />
    </Card>
  );
}

export default PriceCard;
