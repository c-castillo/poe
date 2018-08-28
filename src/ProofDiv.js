import React from "react";
import { ListGroup, ListGroupItem, Badge } from "reactstrap";

function getIpfsLink(hash) {
  let link = "https://ipfs.io/ipfs/" + hash;
  return link;
}

export default function ProofDiv(props) {
  const content = props.items.map(proof => (
    <ListGroupItem className="justify-content-between" key="{proof.hash}">
      <a href={getIpfsLink(proof.hash)}>{proof.hash}</a>
      <Badge pill>{"#" + proof.tags.replace(/;/g, " #")}</Badge>
    </ListGroupItem>
  ));
  return <ListGroup>{content}</ListGroup>;
}
