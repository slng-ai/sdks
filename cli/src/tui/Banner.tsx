import React from "react";
import BigText, { type CFontProps } from "ink-big-text";

interface BannerProps {
  text: string;
  font?: CFontProps["font"];
  /** Tints. Pass a single colour or a gradient (cfonts maps colours to chars). */
  colors?: string[];
}

/** ASCII-art banner using cfonts via ink-big-text. */
export function Banner({ text, font = "block", colors = ["yellow"] }: BannerProps): React.ReactElement {
  return <BigText text={text} font={font} colors={colors} space={false} />;
}
