"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api, Blog } from "@/lib/api";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Image as ImageIcon, Video, Send, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/blog/rich-text-editor"), {
  ssr: false,
  loading: () => <div className="h-96 bg-muted animate-pulse rounded-lg" />,
});

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [videoLinkInput, setVideoLinkInput] = useState("");

  const slug = params.slug as string;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    cover_image: "",
    video_links: [] as string[],
    is_published: false,
  });

  useEffect(() => {
    async function fetchBlog() {
      try {
        const data = await api.getBlogBySlug(slug);
        setBlog(data);

        // Check if user is the author
        if (user && data.author_id !== user.id) {
          toast.error("You are not authorized to edit this blog");
          router.push(`/blogs/${slug}`);
          return;
        }

        // Populate form
        setFormData({
          title: data.title,
          description: data.description || "",
          content: data.content,
          cover_image: data.cover_image || "",
          video_links: data.video_links || [],
          is_published: data.is_published,
        });
      } catch (error: any) {
        console.error("Failed to fetch blog:", error);
        toast.error("Blog not found");
        router.push("/blogs");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug && user) {
      fetchBlog();
    } else if (!user) {
      router.push("/login");
    }
  }, [slug, user, router]);

  const handleAddVideoLink = () => {
    if (videoLinkInput.trim()) {
      setFormData({
        ...formData,
        video_links: [...formData.video_links, videoLinkInput.trim()],
      });
      setVideoLinkInput("");
    }
  };

  const handleRemoveVideoLink = (index: number) => {
    setFormData({
      ...formData,
      video_links: formData.video_links.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (publishStatus?: boolean) => {
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    if (!token || !blog) {
      toast.error("You must be logged in to edit a blog");
      return;
    }

    setIsSaving(true);

    try {
      const updateData = {
        ...formData,
        is_published: publishStatus !== undefined ? publishStatus : formData.is_published,
      };

      const updatedBlog = await api.updateBlog(token, blog.id, updateData);
      toast.success("Blog updated successfully!");
      router.push(`/blogs/${updatedBlog.slug}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update blog");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-24 max-w-4xl">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/blogs/${slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">Edit Blog</h1>
          <p className="text-muted-foreground mt-2">Update your blog post</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
            <CardDescription>Update the details below to modify your blog post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter a compelling title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Input
                id="description"
                placeholder="A brief summary of your blog (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">Content *</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">
                <ImageIcon className="inline h-4 w-4 mr-1" />
                Cover Image URL
              </Label>
              <Input
                id="cover_image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              />
              {formData.cover_image && (
                <div className="mt-2 border rounded-lg overflow-hidden">
                  <img
                    src={formData.cover_image}
                    alt="Cover preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      toast.error("Invalid image URL");
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                <Video className="inline h-4 w-4 mr-1" />
                Video Links
              </Label>
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
                />
                <Button type="button" onClick={handleAddVideoLink} variant="outline">
                  Add
                </Button>
              </div>
              {formData.video_links.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formData.video_links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm flex-1 truncate">{link}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVideoLink(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              {!formData.is_published && (
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={isSaving}
                  variant="outline"
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save as Draft"}
                </Button>
              )}
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isSaving}
                className={!formData.is_published ? "flex-1" : "w-full"}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : formData.is_published ? "Update Blog" : "Publish Blog"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
