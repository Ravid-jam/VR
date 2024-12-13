import React from "react";
type Props = {
  children: any;
};
export default function layout({ children }: Props) {
  return <div>{children}</div>;
}
