// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === "figma") {
  const textFrame = figma.currentPage.selection[0] as FrameNode;
  const desktopFontItems = [];
  const mobileFontItems = [];
  textFrame.children.forEach((child) => {
    if (child.type === "GROUP" && child.name === "Desktop Styles") {
      child.children.forEach((fontSection) => {
        if (fontSection.type === "FRAME" && fontSection.name === "StyleInfo") {
          fontSection.children.forEach((fontInfoItem) => {
            let fontName = "";
            let fontSizeDesktop = "";
            let lineHeightDesktop = "";
            let letterSpacingDesktop = "";
            if (fontInfoItem.type === "FRAME") {
              fontInfoItem.children.forEach((details) => {
                if (details.type === "FRAME" && details.children.length === 1) {
                  fontName = (details.children[0] as TextNode).characters;
                } else if (details.type === "FRAME") {
                  details.children.forEach((fontData, index) => {
                    if (index === 0)
                      fontSizeDesktop = (fontData as TextNode).characters;
                    else if (index === 2)
                      lineHeightDesktop = (fontData as TextNode).characters;
                    else if (index === 3)
                      letterSpacingDesktop = (fontData as TextNode).characters;
                  });
                }
              });
              desktopFontItems.push({
                fontName,
                fontSizeDesktop,
                lineHeightDesktop,
                letterSpacingDesktop,
              });
            }
          });
        }
      });
      console.log("DESKTOP DATA", desktopFontItems);
    } else if (child.type === "GROUP" && child.name === "Mobile Text Styles") {
      child.children.forEach((fontSection) => {
        if (fontSection.type === "FRAME" && fontSection.name === "StyleInfo") {
          fontSection.children.forEach((fontInfoItem) => {
            let fontName = "";
            let fontSizeMobile = "";
            let lineHeightMobile = "";
            let letterSpacingMobile = "";
            if (fontInfoItem.type === "FRAME") {
              fontInfoItem.children.forEach((details) => {
                if (details.type === "FRAME" && details.children.length === 1) {
                  fontName = (details.children[0] as TextNode).characters;
                } else if (details.type === "FRAME") {
                  details.children.forEach((fontData, index) => {
                    if (index === 0)
                      fontSizeMobile = (fontData as TextNode).characters;
                    else if (index === 2)
                      lineHeightMobile = (fontData as TextNode).characters;
                    else if (index === 3)
                      letterSpacingMobile = (fontData as TextNode).characters;
                  });
                }
              });
              mobileFontItems.push({
                fontName,
                fontSizeMobile,
                lineHeightMobile,
                letterSpacingMobile,
              });
            }
          });
        }
      });
      console.log("MOBILE DATA", mobileFontItems);
    }
  });

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
}
