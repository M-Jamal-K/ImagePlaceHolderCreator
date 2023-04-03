const express = require("express");
const { createCanvas } = require("canvas");

// express app
const app = express();
const port = process.env.PORT || 3200;

// Listen for request
app.listen(port, () => {
  console.log(`listen on port ${port}`);
});

app.use("/", (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    express.static("public")(req, res, next);
  } else {
    next();
  }
});

app.get("*", (req, res) => {
  const thePath = parseInt(req.path.split("/")[1]);

  const defaultObject = {
    w: thePath ? thePath : 300,
    h: thePath ? thePath : 300,
    c: "#CCCCCC",
    txt: thePath
      ? `${thePath} x ${thePath}`
      : req.query.txt
      ? req.query.txt
      : req.query.w || req.query.h
      ? `${req.query.w ? req.query.w : "300"} x ${
          req.query.h ? req.query.h : "300"
        }`
      : `300 x 300`,
    txtc: "#5e5e5e"
  };

  const newObj = { ...defaultObject, ...req.query };

  if (!isNaN(thePath) || Object.values(req.query).length) {
    const canvasWidth = parseInt(newObj.w);
    const canvasHeight = parseInt(newObj.h);

    const canvas = createCanvas(canvasWidth, canvasHeight);

    const context = canvas.getContext("2d");

    context.fillStyle = newObj.c;

    context.fillRect(0, 0, canvas.width, canvas.height);

    const fontSize = Math.min(canvas.width, canvas.height) * 0.1;
    context.font = `${fontSize}px Arial`;

    context.textAlign = "center";
    context.textBaseline = "middle";

    const Pos_x = canvas.width / 2;
    const Pos_y = canvas.height / 2;

    context.fillStyle = newObj.txtc;
    context.fillText(newObj.txt, Pos_x, Pos_y);

    const buffer = canvas.toBuffer();
    res.set("Content-Type", "image/png");
    res.set("Content-Length", buffer.length);
    res.send(buffer);
  } else {
    res
      .status(404)
      .send(
        `<body style="background:black; text-align: center; margin:10px"><h1 style="color:white">Something Went Wrong, plaese Check the url Or <a href="/">Click Here</a></h1></body>`
      );
  }
});
