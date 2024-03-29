"use client";

import { addProduct, updateProduct } from "@/app/admin/_actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import type { Product } from "@prisma/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

const ProductForm = ({ product }: { product?: Product | null }) => {
  const [error, action] = useFormState(
    product === null || product === undefined
      ? addProduct
      : updateProduct.bind(null, product.id),
    {},
  );
  const [priceInCents, setPriceinCents] = useState<number | undefined>(
    product?.priceInCents,
  );

  const RenderImage = () => {
    if (product !== null || product !== undefined) {
      return (
        <Image
          src={product!.imagePath}
          alt={`${product!.name} image`}
          width={600}
          height={600}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      );
    }
  };

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          className={cn({ "outline outline-red-400": error.name })}
          defaultValue={product?.name}
        />
        {error.name && toast.error(error.name)}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price in Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          value={priceInCents}
          onChange={(e) =>
            setPriceinCents(
              Number(e.target.value) || parseFloat(e.target.value),
            )
          }
          className={cn({ "outline outline-red-400": error.priceInCents })}
          required
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents ? priceInCents : 0) / 100)}
          {error.priceInCents && toast.error(error.priceInCents)}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Name</Label>
        <Textarea
          id="description"
          name="description"
          required
          className={cn({ "outline outline-red-400": error.description })}
          defaultValue={product?.description}
        />
        {error.description && toast.error(error.description)}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          type="file"
          id="file"
          name="file"
          required={product === null}
          className={cn({ "outline outline-red-400": error.file })}
        />
        {product !== null && <div>{product?.filePath}</div>}
        {error.file && toast.error(error.file)}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          required={product === null}
          className={cn({ "outline outline-red-400": error.image })}
        />
        {<RenderImage />}
        {error.image && toast.error(error.image)}
      </div>
      <SubmitButton />
    </form>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="animate-spin " />
          <span>Saving...</span>
        </>
      ) : (
        "Save"
      )}
    </Button>
  );
};

export default ProductForm;
