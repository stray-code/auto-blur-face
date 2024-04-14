import { useEffect, useState } from "react";
import {
  SsdMobilenetv1Options,
  detectAllFaces,
  loadSsdMobilenetv1Model,
} from "face-api.js";

import type { FaceForm } from "../types";

export const useFaceBlur = () => {
  const [blurredImage, setBlurredImage] = useState("");

  const onSubmit = async ({ imageUrl, minConfidence, blurRatio }: FaceForm) => {
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;

    const options = new SsdMobilenetv1Options({ minConfidence });

    // ぼかし位置のリスト
    const results = await detectAllFaces(imageElement, options);

    const { naturalWidth, naturalHeight } = imageElement;

    const canvas = document.createElement("canvas");
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

    // ぼかした画像
    const imageData = await new Promise<string>((resolve) => {
      const image = new Image();
      // 画像読み込み
      image.onload = () => {
        ctx.drawImage(image, 0, 0);

        let path = new Path2D();

        for (const x of results) {
          const box = x.box;

          path = new Path2D(path);
          path.rect(box.x, box.y, box.width, box.height);
        }

        ctx.clip(path);

        ctx.filter = `blur(${(naturalWidth + naturalHeight) * blurRatio}px)`;
        ctx.drawImage(image, 0, 0);

        const data = canvas.toDataURL();

        resolve(data);
      };
      image.src = imageUrl;
    });

    setBlurredImage(imageData);
  };

  // faceapiのmodel読み込み
  useEffect(() => {
    (async () => {
      await loadSsdMobilenetv1Model("./models");
    })();
  }, []);

  return {
    blurredImage,
    onSubmit,
  };
};
