"use server"

import db from "@/db/db"
import { toast } from "sonner"
import {  z } from "zod"
import fs from "fs/promises"
import { redirect } from "next/navigation"

const fileSchema = z.instanceof(File, {message: "a file required"})
const imageScheme = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"))



const addSchema = z.object({
    name: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    description: z.string().min(1),
    file: fileSchema.refine(file => file.size > 0, "Required"),
    image: imageScheme.refine(file => file.size > 0, "Required")
    
})

const addProduct = async(prevState:unknown,formData:FormData) => {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if(result.success === false){
        
        return result.error.formErrors.fieldErrors
    }

    const data = result.data

    const createDir = async(dir:string)=>{
        try {
            await fs.mkdir(dir,{recursive:true})
        } catch (error) {
            console.error("Error when creating directory",error)
            throw error
        }
    }


    await createDir("products")
    const filePath= `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(`${filePath}`, Buffer.from(await data.file.arrayBuffer()))

    await createDir("public/products")
    const imagePath= `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`public/${filePath}`, Buffer.from(await data.image.arrayBuffer()))

    await db.product.create({data:{
        isAvailableforPurchase: false,
        name: data.name,
        priceInCents: data.priceInCents,
        description: data.description,
        filePath,
        imagePath

    }})


    redirect("/admin/products")

}

export default addProduct