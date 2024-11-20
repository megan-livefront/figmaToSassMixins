// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === "figma") {
  const parentFrame = figma.currentPage.selection[0] as FrameNode;
  const desktopFontItems = getFontData(parentFrame, "Desktop Styles");
  const mobileFontItems = getFontData(parentFrame, "Mobile Text Styles");

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
}

type FontData = {
  fontName: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
};

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
                  fontName = (details.children[0] as TextNode).characters;
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

  console.log(nodeName, fontData);
  return fontData;
}
