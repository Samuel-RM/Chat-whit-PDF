import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

// CI config
cloudinary.config({
  cloud_name: "samrm",
  api_key: import.meta.env.OPENAI_KEY,
  api_secret: import.meta.env.CLOUDINARY_SECRET,
});

const outputDir = path.join(process.cwd(), "public/text");

// To be truly honest i dont know what i am doing here :)
const uploadStream = async (
  buffer: Uint8Array,
  options: {
    folder: string;
    ocr?: string;
  }
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);
      })
      .end(buffer);
  });
};

// Upload API Route
// This route will receive a file and upload it to Cloudinary
// It will return the id, url and pages of the uploaded file
// The file will be stored in the 'pdf' folder in Cloudinary
// The OCR will be performed on the uploaded file and the result will be stored in the 'ocr' folder in Cloudinary
export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response("No file", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const result = await uploadStream(uint8Array, {
    folder: "pdf",
    ocr: "adv_ocr",
  });

  const { asset_id: id, secure_url: url, pages, info } = result;

  const data = info?.ocr?.adv_ocr?.data;

  const text = data
    .map((blocks: { textAnnotations: { description: string }[] }) => {
      const annotations = blocks["textAnnotations"] ?? {};
      const firts = annotations[0] ?? {};
      const content = firts["description"] ?? "";
      return content.trim();
    })
    .filter(Boolean)
    .join("\n");

  // Auto 'delay'
  // await new Promise(resolve => setTimeout(resolve, 2000))

  console.log(result);

  // TODO:
  // 1. Meter esta info en una base de datos
  // Mejor todavia en un vector y hacer los embeddings
  // pero no lo hare por cuestiones de tiempo

  fs.writeFile(`${outputDir}/${id}.txt`, text, "utf-8");

  return new Response(
    JSON.stringify({
      id,
      url,
      pages,
    })
  );
};

// Leer sobre el uso de vectores para la optimizacion y el uso de Ia
// OpemAI tiene uno { hay que Buscarlo xd}
