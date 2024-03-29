"use server"

import db from "@/db/db"
import fs from "fs/promises"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"
import { z } from "zod"

const fileSchema = z.instanceof(File, {message: "a file required"})
const imageScheme = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"))



const addSchema = z.object({
    name: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    description: z.string().min(1),
    file: fileSchema.refine(file => file.size > 0, "Required"),
    image: imageScheme.refine(file => file.size > 0, "Required")
    
})

export async function addProduct(prevState:unknown,formData:FormData) {
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
    await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

    await db.product.create({data:{
        isAvailableforPurchase: false,
        name: data.name,
        priceInCents: data.priceInCents,
        description: data.description,
        filePath,
        imagePath

    }})

    revalidatePath("/admin/products")
    redirect("/admin/products")

}

const editScheme = addSchema.extend({
    file: fileSchema.optional(),
    image: fileSchema.optional()
})

export async function updateProduct(id:string,prevState:unknown,formData:FormData) {
    const result = editScheme.safeParse(Object.fromEntries(formData.entries()))
    if(result.success === false){
        
        return result.error.formErrors.fieldErrors
    }

    const data = result.data
    const product = await db.product.findUnique({where: {id}})

    if(product === null) return notFound()

   

    let filePath = product.filePath
    if(data.file !== undefined && data.file.size > 0){
        await fs.unlink(filePath)
        filePath = `products/${crypto.randomUUID()}-${data.file.name}`
        await fs.writeFile(`${filePath}`, Buffer.from(await data.file.arrayBuffer()))
    }
    let imagePath = product.imagePath
    if(data.image !== undefined && data.image.size> 0){
        await fs.unlink(`public/${imagePath}`)
        imagePath= `/products/${crypto.randomUUID()}-${data.image.name}`
        await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
    }

    await db.product.update({where:{id},data:{
        name: data.name,
        priceInCents: data.priceInCents,
        description: data.description,
        filePath,
        imagePath

    }})

    revalidatePath("/admin/products")
    redirect("/admin/products")

}


export async function toggleProductAvailability(id:string, isAvailableforPurchase:boolean){
    await db.product.update({where:{id}, data:{isAvailableforPurchase}})
    revalidatePath("/admin/products")
}

export async function deleteProduct(id:string){
  const product =   await db.product.delete({where:{id}})

  if(product === null) return notFound()
    revalidatePath("/admin/products")

    await fs.unlink(product.filePath)
    await fs.unlink(`public/${product.imagePath}`)
}