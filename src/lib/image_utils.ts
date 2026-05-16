export function toBase64(file: File, aspectRatio: number = 1): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size / aspectRatio;
      ctx.drawImage(
        img,
        (img.width - size) / 2,
        (img.height - size / aspectRatio) / 2,
        size,
        size / aspectRatio,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      resolve(canvas.toDataURL());
    };
  });
}

export function gamma(r: number, g: number, b: number) {
  return Math.pow(
    (Math.pow(r, 2.2) + Math.pow(1.5 * g, 2.2) + Math.pow(0.6 * b, 2.2)) /
      (1 + Math.pow(1.5, 2.2) + Math.pow(0.6, 2.2)),
    1 / 2.2,
  );
}
