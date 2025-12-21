import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/product";

export async function GET() {
    try {
        console.log("=== GET Products API Called ===");
        await connectDB();
        
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);
        
        if (products.length > 0) {
            console.log("First product raw:", products[0]);
            console.log("First product _id:", products[0]._id);
            console.log("First product _id type:", typeof products[0]._id);
            console.log("First product _id toString:", products[0]._id.toString());
        }
        
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
    await connectDB();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product,{status:201});
}
