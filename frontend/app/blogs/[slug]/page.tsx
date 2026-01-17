"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, Blog } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Edit, Trash2, Video } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const slug = params.slug as string;

  useEffect(() => {
    async function fetchBlog() {
      try {
        const data = await api.getBlogBySlug(slug);
        setBlog(data);
      } catch (error: any) {
        console.error("Failed to fetch blog:", error);
        toast.error("Blog not found");
        router.push("/blogs");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchBlog();
    }
  }, [slug, router]);

  const handleDelete = async () => {
    if (!blog || !token) return;

    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.deleteBlog(token, blog.id);
      toast.success("Blog deleted successfully");
      router.push("/blogs");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog");
    } finally {
      setIsDeleting(false);
    }
  };

  const getAuthorInitials = () => {
    if (!blog) return "U";
    if (blog.author.first_name && blog.author.last_name) {
      return `${blog.author.first_name[0]}${blog.author.last_name[0]}`.toUpperCase();
    }
    return blog.author.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getAuthorName = () => {
    if (!blog) return "Unknown";
    if (blog.author.first_name && blog.author.last_name) {
      return `${blog.author.first_name} ${blog.author.last_name}`;
    }
    return blog.author.full_name;
  };

  const isAuthor = user && blog && user.id === blog.author_id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>
        </div>

        <article>
          {/* Cover Image */}
          {blog.cover_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {blog.title}
          </h1>

          {/* Description */}
          {blog.description && (
            <p className="text-xl text-muted-foreground mb-8">
              {blog.description}
            </p>
          )}

          {/* Author Info & Actions */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={blog.author.profile_picture} />
                <AvatarFallback>{getAuthorInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{getAuthorName()}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {blog.published_at
                      ? format(new Date(blog.published_at), "MMMM d, yyyy")
                      : format(new Date(blog.created_at), "MMMM d, yyyy")}
                  </span>
                  {!blog.is_published && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded text-xs font-medium">
                      Draft
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Edit/Delete buttons for author */}
            {isAuthor && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/blogs/${blog.slug}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="prose prose-invert max-w-none mb-12 tiptap"
            style={{ color: 'var(--foreground)' }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Video Links */}
          {blog.video_links && blog.video_links.length > 0 && (
            <Card className="p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Video className="h-5 w-5" />
                Related Videos
              </h3>
              <div className="space-y-3">
                {blog.video_links.map((link, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {link}
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
