"use client";

import { useEffect, useState } from "react";
import { api, BlogListItem } from "@/lib/api";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<BlogListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const data = await api.getBlogs();
                setBlogs(data);
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    const getAuthorInitials = (author: BlogListItem["author"]) => {
        if (author.first_name && author.last_name) {
            return `${author.first_name[0]}${author.last_name[0]}`.toUpperCase();
        }
        return author.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navigation />

            <main className="flex-1 container mx-auto px-4 py-24 max-w-6xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Fitness Blogs</h1>
                    <p className="text-xl text-muted-foreground">Insights and wisdom from our community.</p>
                </div>

                {isLoading ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-lg">
                        <p className="text-lg text-muted-foreground">No blogs published yet. Stay tuned!</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog) => (
                            <Card key={blog.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow border-muted">
                                {blog.cover_image && (
                                    <Link href={`/blogs/${blog.slug}`} className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                                        />
                                    </Link>
                                )}

                                <CardHeader className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={blog.author.profile_picture} />
                                            <AvatarFallback>{getAuthorInitials(blog.author)}</AvatarFallback>
                                        </Avatar>
                                        <div className="text-sm">
                                            <p className="font-medium leading-none">
                                                {blog.author.first_name && blog.author.last_name
                                                    ? `${blog.author.first_name} ${blog.author.last_name}`
                                                    : blog.author.full_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {format(new Date(blog.created_at), "MMM d, yyyy")}
                                            </p>
                                        </div>
                                    </div>
                                    <Link href={`/blogs/${blog.slug}`}>
                                        <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                                            {blog.title}
                                        </CardTitle>
                                    </Link>
                                </CardHeader>

                                <CardContent className="p-6 pt-0 flex-1">
                                    <p className="text-muted-foreground text-sm line-clamp-3">
                                        {blog.description || "Read the full article to learn more..."}
                                    </p>
                                </CardContent>

                                <CardFooter className="p-6 border-t bg-muted/50 flex justify-between items-center text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>5 min read</span>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild className="h-auto p-0 font-medium text-primary hover:text-primary/80 hover:bg-transparent">
                                        <Link href={`/blogs/${blog.slug}`}>
                                            Read more
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
