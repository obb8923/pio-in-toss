export interface CanvasCompressOptions {
  maxDimension?: number; // 긴 변 기준 최대 픽셀
  quality?: number; // 0~1
}

export async function compressBase64WithCanvas(base64: string, options: CanvasCompressOptions = {}): Promise<string> {
  const { maxDimension = 1440, quality = 0.8 } = options;

  try {
    // 웹 환경에서만 동작 (DOM이 없으면 원본 반환)
    if (typeof globalThis === 'undefined') {
      return base64;
    }

    const dataUrl = `data:image/jpeg;base64,${base64}`;
    const img = await new Promise<any>((resolve, reject) => {
      const ImageCtor: any = (globalThis as any).Image;
      const image = new ImageCtor();
      image.onload = () => resolve(image);
      image.onerror = (_e: unknown) => reject(_e);
      image.src = dataUrl;
    });

    const width = Number(img.width);
    const height = Number(img.height);
    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    const doc: any = (globalThis as any).document;
    const canvas: any = doc.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return base64;
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    // data:image/jpeg;base64,.... 에서 base64만 추출
    const result = compressedDataUrl.includes(',') ? compressedDataUrl.split(',')[1] : compressedDataUrl;
    return result;
  } catch {
    return base64;
  }
}


