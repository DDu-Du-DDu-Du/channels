interface HexConvertForRGBAParams {
  hex: string;
  alpha: number;
}

function hexConvertForRGBA({ hex, alpha }: HexConvertForRGBAParams): string {
  let code = hex;

  if (code.startsWith("#")) {
    code = code.replace(/#/g, "");
  }

  const rgbList = code.match(/.{2}/g)?.map((part) => parseInt(part, 16) || 0) ?? [0, 0, 0];

  return `rgba(${rgbList.join(",")},${alpha})`;
}

export default hexConvertForRGBA;
