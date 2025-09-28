// utils.js
export const getCroppedImg = (imageSrc, crop, zoom) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous"; // handle cross-origin if needed
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;

      // Size of cropped area
      const cropWidth = naturalWidth / zoom;
      const cropHeight = naturalHeight / zoom;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Draw the cropped area
      ctx.drawImage(
        image,
        (crop.x * naturalWidth) / 100, // x offset
        (crop.y * naturalHeight) / 100, // y offset
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };
    image.onerror = (err) => reject(err);
  });
};
