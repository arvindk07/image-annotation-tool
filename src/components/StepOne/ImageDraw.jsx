import { useEffect, useRef, useState } from "react";

const ImageDraw = () => {
  const [cursorMode, setCursorMode] = useState("cursor");
  const [image, setImage] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;

    const ctx = canvas.getContext("2d");
    if (image) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(scale, scale);
      ctx.drawImage(image, offset.x / scale, offset.y / scale);
      ctx.restore();
    }
  }, [image, offset, scale]);

  const handleImageUpload = (event) => {
    const img = new Image();
    img.src = URL.createObjectURL(event.target.files[0]);
    img.onload = () => {
      setImage(img);
      setOffset({ x: 0, y: 0 });
      setScale(1);
    };
  };

  const handleWheel = (e) => {
    if (cursorMode === "zoom" && image) {
      e.preventDefault();
      const zoomIntensity = 0.1;
      const newScale = scale + (e.deltaY < 0 ? zoomIntensity : -zoomIntensity);
      setScale(Math.max(newScale, 0.1));
    }
  };

  return (
    <div>
      <div className="button-controller-wrap ">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button>Cursor</button>
        <button>Drag</button>
        <button onClick={() => setCursorMode("zoom")}>Zoom</button>
      </div>
      <div className="convas-wrap">
        <canvas
          ref={canvasRef}
          onWheel={handleWheel}
          style={{
            cursor: cursorMode === "drag" ? "grab" : "default",
          }}
        />
      </div>
    </div>
  );
};

export default ImageDraw;
