// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === "figma") {
  // console.log("SELECTION", figma.currentPage.selection);
  const textFrame = figma.currentPage.selection[0] as FrameNode;
  const fontItems = [];
  textFrame.children.forEach((child) => {
    // console.log(child);
    if (child.type === "GROUP" && child.name === "Desktop Styles") {
      child.children.forEach((fontSection) => {
        if (fontSection.type === "FRAME" && fontSection.name === "StyleInfo") {
          fontSection.children.forEach((fontInfoItem) => {
            let fontName = "";
            let fontSizeDesktop = "";
            let lineHeightDesktop = "";
            let letterSpacingDesktop = "";
            // let fontSizeMobile = "";
            // let lineHeightMobile = "";
            // let letterSpacingMobile = "";
            if (fontInfoItem.type === "FRAME") {
              fontInfoItem.children.forEach((details) => {
                if (details.type === "FRAME" && details.children.length === 1) {
                  fontName = (details.children[0] as TextNode).characters;
                } else if (details.type === "FRAME") {
                  console.log("DETAILS", details);
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
              fontItems.push({
                fontName,
                fontSizeDesktop,
                lineHeightDesktop,
                letterSpacingDesktop,
              });
            }
          });
        }
      });
      console.log("DATA", fontItems);
    }
  });

  // const nodes: SceneNode[] = [];
  // for (let i = 0; i < numberOfRectangles; i++) {
  //   const rect = figma.createRectangle();
  //   rect.x = i * 150;
  //   rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
  //   figma.currentPage.appendChild(rect);
  //   nodes.push(rect);
  // }
  // figma.currentPage.selection = nodes;
  // figma.viewport.scrollAndZoomIntoView(nodes);

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
}
