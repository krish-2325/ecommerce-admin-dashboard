import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import { productSchema } from "@/lib/validators/product";
import cloudinary from "@/lib/cloudinary";
export async function GET() {
    try {
        console.log("=== GET Products API Called ===");
        await connectDB();
        
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);
        
        // if (products.length > 0) {
        //     console.log("First product raw:", products[0]);
        //     console.log("First product _id:", products[0]._id);
        //     console.log("First product _id type:", typeof products[0]._id);
        //     console.log("First product _id toString:", products[0]._id.toString());
        // }
        
        // Convert to plain objects with string IDs
        const serializedProducts = products.map(product => {
            const prodObj = product.toObject();
            return {
                ...prodObj,
                _id: prodObj._id.toString()
            };
        });
        
        console.log("Serialized first product:", serializedProducts[0]);
        
        return NextResponse.json(serializedProducts);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
export async function POST(req: Request)
{
    try{
        const formData=await req.formData();
        const name =formData.get("name");
        const price =Number(formData.get("price"));
        const stock =Number(formData.get("stock"));
        const category =formData.get("category");
        const image=formData.get("image") as File|null;
        const parsed =productSchema.safeParse({
            name,
            price,
            stock,
            category,
        });
        if(!parsed.success)
        {
            return NextResponse.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }
        if(!image)
        {
            return NextResponse.json(
                {errors:{image:["Image is required"]}},
                {status:400}
            );
        }
        const bytes=await image.arrayBuffer();
        const buffer=Buffer.from(bytes);
        const uploadResult:any = await new Promise((resolve,reject)=>
        {
            cloudinary.uploader.upload_stream(
                {folder :"products",},
                    (error,result)=>{
                        if(error) reject (error);
                        resolve(result);
                    }
            ).end(buffer);
        })
        await connectDB();
        const product = await Product.create({
            ...parsed.data,
            image: uploadResult.secure_url
        });
        return NextResponse.json(product,{status:201});
    }
    catch(error)
    {
        return NextResponse.json(
            {error:"Failed to create product"},
            {status:500}
        );
    }
}
