// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

type FontData = {
  fontName: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
};

type FontMixin = {
  fontName: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  desktopFontSize?: string;
  desktopLineHeight?: string;
  desktopLetterSpacing?: string;
};

// Runs this code if the plugin is run in Figma
if (figma.editorType === "figma") {
  const parentFrame = figma.currentPage.selection[0] as FrameNode;
  const desktopFontItems = getFontData(parentFrame, "Desktop Styles");
  const mobileFontItems = getFontData(parentFrame, "Mobile Text Styles");
  const fontMixins: FontMixin[] = [];

  mobileFontItems.forEach((mobileFontItem) => {
    const mixin: FontMixin = mobileFontItem;
    const desktopEquivalent = desktopFontItems.find(
      (desktopFontItem) => desktopFontItem.fontName === mobileFontItem.fontName
    );

    if (desktopEquivalent) {
      if (desktopEquivalent.fontSize !== mobileFontItem.fontSize) {
        mixin.desktopFontSize = desktopEquivalent.fontSize;
      }
      if (desktopEquivalent.lineHeight !== mobileFontItem.lineHeight) {
        mixin.desktopLineHeight = desktopEquivalent.lineHeight;
      }
      if (desktopEquivalent.letterSpacing !== mobileFontItem.letterSpacing) {
        mixin.desktopLetterSpacing = desktopEquivalent.letterSpacing;
      }
    }
    fontMixins.push(mixin);
  });

  const sassMixins = fontMixins.map((mixin) => {
    let mixinString = `@mixin text${mixin.fontName} {\n\t font-size: ${mixin.fontSize};\n\t line-height: ${mixin.lineHeight};\n\t letter-spacing: ${mixin.letterSpacing};`;
    if (
      mixin.desktopFontSize ||
      mixin.desktopLineHeight ||
      mixin.desktopLetterSpacing
    ) {
      mixinString += `\n\n\t @include desktopAndUp {`;
      if (mixin.desktopFontSize)
        mixinString += `\n\t\t font-size: ${mixin.desktopFontSize}`;
      if (mixin.desktopLineHeight)
        mixinString += `\n\t\t line-height: ${mixin.desktopLineHeight}`;
      if (mixin.desktopLetterSpacing)
        mixinString += `\n\t\t letter-spacing: ${mixin.desktopLetterSpacing}`;
      mixinString += `\n\t }`;
    }
    mixinString += `\n }`;

    return mixinString;
  });

  let allMixins = "";
  sassMixins.forEach((sassMixin) => {
    allMixins += `\n\n ${sassMixin}`;
  });

  console.log(allMixins);

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
}

function getFontData(parentFrame: FrameNode, nodeName: string) {
  const fontData: FontData[] = [];
  parentFrame.children.forEach((child) => {
    if (child.type === "GROUP" && child.name === nodeName) {
      child.children.forEach((fontSection) => {
        if (fontSection.type === "FRAME" && fontSection.name === "StyleInfo") {
          fontSection.children.forEach((fontInfoItem) => {
            let fontName = "";
            let fontSize = "";
            let lineHeight = "";
            let letterSpacing = "";
            if (fontInfoItem.type === "FRAME") {
              fontInfoItem.children.forEach((details) => {
                if (details.type === "FRAME" && details.children.length === 1) {
                  fontName = (
                    details.children[0] as TextNode
                  ).characters.replace(/\s+/g, "");
                } else if (details.type === "FRAME") {
                  details.children.forEach((fontData, index) => {
                    if (index === 0)
                      fontSize = (fontData as TextNode).characters;
                    else if (index === 2)
                      lineHeight = (fontData as TextNode).characters;
                    else if (index === 3)
                      letterSpacing = (fontData as TextNode).characters;
                  });
                }
              });
              fontData.push({
                fontName,
                fontSize,
                lineHeight,
                letterSpacing,
              });
            }
          });
        }
      });
    }
  });

  return fontData;
}
