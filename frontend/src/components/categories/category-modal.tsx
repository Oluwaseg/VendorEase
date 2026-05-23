"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-category";
import { CLOUDINARY_FOLDER_CATEGORIES } from '@/lib/cloudinary-folders';
import { Category } from "@/types/category";
import { Plus, X } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from "react";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryModal({ open, onClose, category }: CategoryModalProps) {
  const isEdit = !!category;

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isLoading = createCategory.isPending || updateCategory.isPending;

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: undefined,
    isPublished: true,
  });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        image: category.image,
        isPublished: category.isPublished,
      });
    } else {
      setForm({
        name: "",
        slug: "",
        description: "",
        image: undefined,
        isPublished: true,
      });
    }
  }, [category, open]);

  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSwitch = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      isPublished: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && category) {
      updateCategory.mutate(
        { id: category._id, data: form },
        { onSuccess: onClose },
      );
    } else {
      createCategory.mutate(form, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEdit ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit
              ? "Update the category details below"
              : "Fill in the category information to get started"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Image upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-semibold">
              Image (optional)
            </Label>
            <p className="text-xs text-muted-foreground">
              Upload a category image for UI (Cloudinary)
            </p>
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary/signature"
              options={{ folder: CLOUDINARY_FOLDER_CATEGORIES, multiple: false }}
              onSuccess={(result) => {
                const info = result.info;
                if (typeof info === 'string' || !info?.secure_url || !info?.public_id) return;
                const newImage = { url: info.secure_url, publicId: info.public_id };
                setForm((prev) => ({ ...prev, image: newImage }));
              }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  onClick={() => open()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus size={20} />
                  Upload image
                </Button>
              )}
            </CldUploadWidget>

            {form.image?.url ? (
              <div className="relative rounded-lg overflow-hidden border border-border mt-2">
                <img src={form.image.url} alt="Category" className="w-full h-40 object-cover" />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => setForm((prev) => ({ ...prev, image: undefined }))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : null}

          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Category Name *
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Electronics, Fashion, Books"
              value={form.name}
              onChange={handleChange}
              required
              className="border-border/50 bg-card/50 focus:border-primary focus:bg-card transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-semibold">
              Slug *
            </Label>
            <Input
              id="slug"
              name="slug"
              placeholder="auto-generated from name"
              value={form.slug}
              onChange={handleChange}
              required
              className="border-border/50 bg-card/50 focus:border-primary focus:bg-card transition-colors text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from the category name
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add a detailed description for this category (optional)"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="border-border/50 bg-card/50 focus:border-primary focus:bg-card transition-colors resize-none"
            />
          </div>

          {/* Published Status */}
          <div className="flex items-center justify-between p-4 bg-card/30 border border-border/40 rounded-lg">
            <div>
              <p className="font-semibold text-sm">Publish Category</p>
              <p className="text-xs text-muted-foreground mt-1">
                Make this category visible to users
              </p>
            </div>
            <Switch checked={form.isPublished} onCheckedChange={handleSwitch} />
          </div>
        </form>

        <DialogFooter className="flex gap-2 pt-4 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-border/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {isLoading && <Spinner className="w-4 h-4" />}
            {isEdit ? "Update Category" : "Create Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
