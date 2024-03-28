
import type { APIRoute } from "astro"
import {v2 as cloudinary, type UploadApiResponse} from "cloudinary"

cloudinary.config({ 
  cloud_name: 'dfj0mnrsk', 
  api_key: '752481193566437',
  api_secret: 'FNmpCnpXKVo1TRGlFHyP7zsVeag'
//   api_secret: import.meta.env.CLOUDINARY_SECRET 
});


// To be truly honest i dont know what i am doing here :)
const uploadStream = async(buffer: Uint8Array,  options:{
   folder:string
}): Promise<UploadApiResponse>=> {
  return new Promise((resolve, reject) => {
    cloudinary
      .uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);      
      }).end(buffer)
    })
}

//    return new Promise((resolve, reject) => {
//       cloudinary
//       .uploader
//       .upload_stream(options, (error, result) => {
//          if(result) return  resolve(result)
//           reject(error)
//       }).end(buffer)
//    })
// }


// const outputDir = path.join(process.cwd(), 'public/text')

// const uploadStream = async (buffer: Uint8Array, options: {
//   folder: string,
//   ocr?: string,
// }): Promise<UploadApiResponse> => {
//   return new Promise((resolve, reject) => {
//     cloudinary
//       .uploader
//       .upload_stream(options, (error, result) => {
//         if (result) return resolve(result);
//         reject(error);      
//       }).end(buffer)
//     })
// }

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('file') as File

   if(!file) {
      return new Response('No file', {status: 400})
   }

   const arrayBuffer = await file.arrayBuffer()
   const uint8Array = new Uint8Array(arrayBuffer)

   const result = await uploadStream(uint8Array, {
      folder: 'pdf',
   })

   const {
      asset_id: id,
      secure_url: url,
      pages
   } = result

   // Auto 'delay'
   // await new Promise(resolve => setTimeout(resolve, 2000))
   
   console.log(result);

   
   return new Response(JSON.stringify({
      id,
      url,
      pages
   }))

   
 }
