"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Image as ImageIcon, Video, Send, Save, BookOpen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/blog/rich-text-editor"), {
  ssr: false,
  loading: () => <div className="h-96 bg-muted animate-pulse rounded-lg" />,
});

export default function WritePMBlogPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth(); // Assuming useAuth exposes isLoading
  const [isLoading, setIsLoading] = useState(false);
  const [videoLinkInput, setVideoLinkInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    cover_image: "",
    video_links: [] as string[],
  });

  // Handle Auth Check
  // If loading, show loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not loading and no user, redirect
  if (!user) {
    router.push("/login?redirect=/write-pmblog");
    return null;
  }

  const handleAddVideoLink = () => {
    if (videoLinkInput.trim()) {
      setFormData(prev => ({
        ...prev,
        video_links: [...prev.video_links, videoLinkInput.trim()],
      }));
      setVideoLinkInput("");
      toast.success("Video link added!");
    }
  };

  const handleRemoveVideoLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      video_links: prev.video_links.filter((_, i) => i !== index),
    }));
    toast.success("Video link removed!");
  };

  const handleContentChange = (html: string) => {
    setFormData(prev => ({ ...prev, content: html }));
  };

  const handleSubmit = async (isPublished: boolean) => {
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to create a blog");
      return;
    }

    setIsLoading(true);

    try {
      const blogData = {
        ...formData,
        is_published: isPublished,
      };

      const blog = await api.createBlog(token, blogData);
      toast.success(isPublished ? "Blog published successfully! 🎉" : "Blog saved as draft!");
      router.push(`/blogs/${blog.slug}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create blog");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Write Your Blog</h1>
          </div>
          <p className="text-muted-foreground mt-2 text-lg">
            Share your fitness journey, tips, and insights with the Pro Methods community
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-2xl">Create Your Masterpiece</CardTitle>
            <CardDescription className="text-base">
              Use the rich text editor below to craft an engaging blog post with images, videos, and formatting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-lg font-semibold">
                Blog Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter a compelling title that grabs attention..."
                value={formData.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData(prev => ({ ...prev, title: val }));
                }}
                required
                className="text-lg h-12"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-lg font-semibold">
                Short Description
              </Label>
              <Input
                id="description"
                placeholder="A brief summary that appears in the blog list (optional)"
                value={formData.description}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData(prev => ({ ...prev, description: val }));
                }}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                This helps readers understand what your blog is about before clicking
              </p>
            </div>

            <Separator />

            {/* Cover Image */}
            <div className="space-y-3">
              <Label htmlFor="cover_image" className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Cover Image
              </Label>

              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <Input
                    id="cover_image_file"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Check file size (e.g. 5MB limit)
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("File size too large (max 5MB)");
                        return;
                      }

                      const toastId = toast.loading("Uploading image...");
                      try {
                        const response = await api.uploadImage(file, formData.title);
                        setFormData({ ...formData, cover_image: response.url });
                        toast.success("Image uploaded successfully!", { id: toastId });
                      } catch (error: any) {
                        toast.error(error.message || "Upload failed", { id: toastId });
                      }
                    }}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  <p className="text-sm text-muted-foreground">
                    Max 5MB. Just select to upload.
                  </p>
                </div>

                {/* Manual URL fallback (optional, kept for flexibility but hidden by default or shown as advanced?) 
                    Let's just show the input as readonly if uploaded, or editable if they want to paste external URL 
                */}
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Or URL:</span>
                  <Input
                    id="cover_image"
                    type="url"
                    placeholder="https://..."
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="h-10 text-sm"
                  />
                </div>

                {formData.cover_image && (
                  <div className="relative mt-2 border-2 border-primary/20 rounded-lg overflow-hidden group">
                    <img
                      src={formData.cover_image}
                      alt="Cover preview"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg"; // You might want a real placeholder
                        // toast.error("Invalid image URL"); // Don't spam toast on typing
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setFormData({ ...formData, cover_image: "" })}
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Rich Text Editor */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">
                Blog Content *
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Use the toolbar to format your text, add images, quotes, and more. Write freely and creatively!
              </p>
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
              />
            </div>

            <Separator />

            {/* Video Links */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Video Links (Optional)
              </Label>
              <p className="text-sm text-muted-foreground">
                Add YouTube, Vimeo, or other video links to enhance your blog
              </p>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoLinkInput}
                  onChange={(e) => setVideoLinkInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddVideoLink();
                    }
                  }}
                  className="h-12"
                />
                <Button type="button" onClick={handleAddVideoLink} variant="outline" className="h-12 px-6">
                  Add Link
                </Button>
              </div>
              {formData.video_links.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">Added Videos:</p>
                  {formData.video_links.map((link, index) => (
                    <div key={index} className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border">
                      <Video className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm flex-1 truncate">{link}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVideoLink(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-8" />

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="flex-1 h-12"
              >
                <Save className="mr-2 h-5 w-5" />
                {isLoading ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                size="lg"
                className="flex-1 h-12"
              >
                <Send className="mr-2 h-5 w-5" />
                {isLoading ? "Publishing..." : "Publish Blog"}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground pt-2">
              By publishing, you agree to share your content with the Pro Methods community
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
