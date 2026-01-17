"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Image as ImageIcon, Video, Send, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateBlogPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [videoLinkInput, setVideoLinkInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    cover_image: "",
    video_links: [] as string[],
  });

  // Redirect if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

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
      toast.success(isPublished ? "Blog published successfully!" : "Blog saved as draft!");
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

      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">Write a New Blog</h1>
          <p className="text-muted-foreground mt-2">Share your fitness insights and knowledge with the community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
            <CardDescription>Fill in the details below to create your blog post</CardDescription>
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
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your blog content here... You can use HTML for formatting."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                required
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                You can use HTML tags for formatting (e.g., &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;p&gt;paragraph&lt;/p&gt;)
              </p>
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
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                className="flex-1"
              >
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Publishing..." : "Publish Blog"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
