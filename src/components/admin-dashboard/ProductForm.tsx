"use client";

import addProduct from "@/app/admin/_actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

const ProductForm = () => {
  const [error, action] = useFormState(addProduct, {});
  const [priceInCents, setPriceinCents] = useState<number>();

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
        />
        {error.description && toast.error(error.description)}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          type="file"
          id="file"
          name="file"
          required
          className={cn({ "outline outline-red-400": error.file })}
        />
        {error.file && toast.error(error.file)}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          required
          className={cn({ "outline outline-red-400": error.image })}
        />
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
