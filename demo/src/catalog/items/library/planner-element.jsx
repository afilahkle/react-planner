import * as Three from "three";
import React from "react";

const PI_2 = Math.PI / 2;
const woodTexture = require("./wood.jpg");
const scale = 100;

let textureLoader = new Three.TextureLoader();
textureLoader.setPath("./");
let matWood = textureLoader.load(woodTexture);

function makeLibrary(newWidth, newHeight, newDepth) {
  let matShelf = textureLoader.load(woodTexture, (texture) => {
    texture.wrapS = texture.wrapT = Three.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(
      Math.ceil(newWidth / scale),
      Math.ceil(newHeight / scale)
    );
  });

  let library = new Three.Mesh();

  // Base
  let baseGeometry = new Three.BoxGeometry(newWidth, newHeight / 20, newDepth);
  let baseMaterial = new Three.MeshLambertMaterial({ map: matWood });
  let base = new Three.Mesh(baseGeometry, baseMaterial);
  base.position.set(0, -newHeight / 2 + newHeight / 40, 0);
  library.add(base);

  // Shelves
  let shelfGeometry = new Three.BoxGeometry(newWidth, newHeight / 20, newDepth);
  let shelfMaterial = new Three.MeshLambertMaterial({ map: matShelf });
  let numberOfShelves = 5;
  for (let i = 0; i < numberOfShelves; i++) {
    let shelf = new Three.Mesh(shelfGeometry, shelfMaterial);
    shelf.position.set(
      0,
      -newHeight / 2 + ((i + 1) * newHeight) / (numberOfShelves + 1),
      0
    );
    library.add(shelf);
  }

  // Sides
  let sideGeometry = new Three.BoxGeometry(newDepth, newHeight, newDepth / 10);
  let side1 = new Three.Mesh(sideGeometry, baseMaterial);
  side1.position.set(newWidth / 2, 0, 0);
  library.add(side1);

  let side2 = new Three.Mesh(sideGeometry, baseMaterial);
  side2.position.set(-newWidth / 2, 0, 0);
  library.add(side2);

  return library;
}

export default {
  name: "library",
  prototype: "items",

  info: {
    tag: ["furnishings", "wood"],
    title: "library",
    description: "home library",
    image: require("./library.jpg"),
  },
  properties: {
    width: {
      label: "width",
      type: "length-measure",
      defaultValue: {
        length: 200,
        unit: "cm",
      },
    },
    depth: {
      label: "depth",
      type: "length-measure",
      defaultValue: {
        length: 30,
        unit: "cm",
      },
    },
    height: {
      label: "height",
      type: "length-measure",
      defaultValue: {
        length: 200,
        unit: "cm",
      },
    },
    altitude: {
      label: "altitude",
      type: "length-measure",
      defaultValue: {
        length: 100,
        unit: "cm",
      },
    },
    patternColor: {
      label: "2D color",
      type: "color",
      defaultValue: "#f5f4f4",
    },
  },

  render2D: function (element, layer, scene) {
    let newWidth = element.properties.getIn(["width", "length"]);
    let newDepth = element.properties.getIn(["depth", "length"]);
    let fillValue = element.selected
      ? "#99c3fb"
      : element.properties.get("patternColor");
    let angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin((angle * Math.PI) / 180) < 0) {
      textRotation = 180;
    }

    return (
      <g transform={`translate(${-newWidth / 2},${-newDepth / 2})`}>
        <rect
          key="1"
          x="0"
          y="0"
          width={newWidth}
          height={newDepth}
          style={{
            stroke: element.selected ? "#0096fd" : "#000",
            strokeWidth: "2px",
            fill: fillValue,
          }}
        />
        <text
          key="2"
          x="0"
          y="0"
          transform={`translate(${newWidth / 2}, ${
            newDepth / 2
          }) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}
        >
          {element.name}
        </text>
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    let newWidth = element.properties.getIn(["width", "length"]);
    let newDepth = element.properties.getIn(["depth", "length"]);
    let newHeight = element.properties.getIn(["height", "length"]);
    let newAltitude = element.properties.getIn(["altitude", "length"]);

    let library = new Three.Object3D();
    library.add(makeLibrary(newWidth, newHeight, newDepth));

    if (element.selected) {
      let bbox = new Three.BoxHelper(library, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      library.add(bbox);
    }

    library.position.y += newHeight / 20 + newAltitude;
    return Promise.resolve(library);
  },
};
