"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Image as ImageIcon, 
  Loader2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Quote,
  Code,
  Minus,
  Table,
  CheckSquare,
  Upload,
  FileImage,
  X,
  HelpCircle,
  Strikethrough,
  Highlighter,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Post, Category, Tag } from "@/lib/supabase/types";
import ImageEditor from "./ImageEditor";
import BlogPreview from "./BlogPreview";

interface PostEditorProps {
  post?: Post;
  categories: Category[];
  tags: Tag[];
  selectedTagIds?: string[];
}

export default function PostEditor({ post, categories, tags, selectedTagIds = [] }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [categoryId, setCategoryId] = useState(post?.category_id || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(selectedTagIds);
  const [coverImage, setCoverImage] = useState(post?.cover_image_url || "");
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false);
  const [status, setStatus] = useState<"draft" | "published">(post?.status || "draft");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [inlineUploading, setInlineUploading] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState("");
  const [pendingImageAlt, setPendingImageAlt] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing || !slug) {
      setSlug(generateSlug(value));
    }
  };

  const insertMarkdown = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || placeholder;
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + before.length + selected.length + after.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const insertImageMarkdown = (imageUrl: string, altText: string = "Image") => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const imageMarkdown = `\n\n![${altText}](${imageUrl})\n\n`;
    const newContent = content.substring(0, start) + imageMarkdown + content.substring(start);
    setContent(newContent);
    setShowMediaPicker(false);
    
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInlineUploading(true);
    const supabase = createClient();
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
      setInlineUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    // Open image editor for cropping/editing
    setPendingImageUrl(publicUrl);
    setPendingImageAlt(file.name.split(".")[0]);
    setShowImageEditor(true);
    setInlineUploading(false);
    
    // Reset input
    if (inlineImageInputRef.current) {
      inlineImageInputRef.current.value = "";
    }
  };

  const handleImageEditorSave = (finalUrl: string, altText: string) => {
    insertImageMarkdown(finalUrl, altText);
    setShowImageEditor(false);
    setPendingImageUrl("");
    setPendingImageAlt("");
  };

  const handleImageEditorCancel = () => {
    setShowImageEditor(false);
    setPendingImageUrl("");
    setPendingImageAlt("");
  };

  const openImageEditorFromLibrary = (url: string, altText: string) => {
    setPendingImageUrl(url);
    setPendingImageAlt(altText);
    setShowImageEditor(true);
    setShowMediaPicker(false);
  };

  const loadMediaAssets = async () => {
    setLoadingMedia(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    setMediaAssets(data || []);
    setLoadingMedia(false);
  };

  const openMediaPicker = () => {
    setShowMediaPicker(true);
    loadMediaAssets();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    setCoverImage(publicUrl);
    setUploading(false);
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleSave = async (saveStatus: "draft" | "published") => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const postData = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim() || null,
      content: content.trim() || null,
      category_id: categoryId || null,
      cover_image_url: coverImage || null,
      is_featured: isFeatured,
      status: saveStatus,
      reading_time_minutes: calculateReadingTime(content),
      published_at: saveStatus === "published" ? new Date().toISOString() : post?.published_at || null,
      author_name: "Bhukya Krishna",
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", post.id);

        if (error) throw error;

        // Update tags
        await supabase.from("post_tags").delete().eq("post_id", post.id);
        if (selectedTags.length > 0) {
          await supabase.from("post_tags").insert(
            selectedTags.map((tagId) => ({ post_id: post.id, tag_id: tagId }))
          );
        }
      } else {
        const { data: newPost, error } = await supabase
          .from("posts")
          .insert(postData)
          .select()
          .single();

        if (error) throw error;

        // Add tags
        if (selectedTags.length > 0 && newPost) {
          await supabase.from("post_tags").insert(
            selectedTags.map((tagId) => ({ post_id: newPost.id, tag_id: tagId }))
          );
        }
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (error: any) {
      alert("Error saving post: " + error.message);
      setSaving(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title */}
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6">
          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-transparent text-2xl font-serif text-white placeholder-gray-600 focus:outline-none"
          />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-500">Slug:</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              className="flex-1 bg-transparent text-sm text-gray-400 focus:outline-none focus:text-white"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
          <textarea
            placeholder="A brief summary of your post..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none"
          />
        </div>

        {/* Content Editor */}
        <div className="rounded-xl border border-gold/20 bg-white/5 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 border-b border-gold/20 p-2 bg-white/5">
            {/* Headings */}
            <button
              type="button"
              onClick={() => insertMarkdown("# ", "\n", "Heading")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Heading 1 (# text)"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("## ", "\n", "Heading")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Heading 2 (## text)"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("### ", "\n", "Heading")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Heading 3 (### text)"
            >
              <Heading3 className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gold/20 mx-1" />
            
            {/* Text Formatting */}
            <button
              type="button"
              onClick={() => insertMarkdown("**", "**", "bold text")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Bold (**text**)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("*", "*", "italic text")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Italic (*text*)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("~~", "~~", "strikethrough")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Strikethrough (~~text~~)"
            >
              <Strikethrough className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gold/20 mx-1" />
            
            {/* Lists */}
            <button
              type="button"
              onClick={() => insertMarkdown("- ", "\n", "List item")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Bullet List (- item)"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("1. ", "\n", "List item")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Numbered List (1. item)"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("- [ ] ", "\n", "Task item")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Checkbox (- [ ] item)"
            >
              <CheckSquare className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gold/20 mx-1" />
            
            {/* Links & Media */}
            <button
              type="button"
              onClick={() => insertMarkdown("[", "](https://example.com)", "link text")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Link ([text](url))"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            
            {/* IMAGE UPLOAD - Key Feature */}
            <div className="relative">
              <button
                type="button"
                onClick={() => inlineImageInputRef.current?.click()}
                disabled={inlineUploading}
                className="p-2 rounded hover:bg-gold/20 text-gold hover:text-gold-light transition-colors relative"
                title="Upload & Insert Image"
              >
                {inlineUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </button>
              <input
                ref={inlineImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleInlineImageUpload}
                className="hidden"
                disabled={inlineUploading}
              />
            </div>
            
            <button
              type="button"
              onClick={openMediaPicker}
              className="p-2 rounded hover:bg-gold/20 text-gold hover:text-gold-light transition-colors"
              title="Choose from Media Library"
            >
              <FileImage className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gold/20 mx-1" />
            
            {/* Blocks */}
            <button
              type="button"
              onClick={() => insertMarkdown("> ", "\n", "Quote text")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Quote (> text)"
            >
              <Quote className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("`", "`", "code")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Inline Code (`code`)"
            >
              <Code className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("\n```\n", "\n```\n", "code block")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Code Block (```code```)"
            >
              <span className="text-xs font-mono">{"</>"}</span>
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n", "")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Insert Table"
            >
              <Table className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("\n---\n", "")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Horizontal Rule (---)"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("\n> ⚠️ **Note:** ", "\n", "Important information here")}
              className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Callout/Alert"
            >
              <AlertCircle className="h-4 w-4" />
            </button>
            
            {/* Help */}
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className={`p-2 rounded transition-colors ${showHelp ? 'bg-gold/20 text-gold' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
              title="Markdown Help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
          
          {/* Markdown Help Panel */}
          {showHelp && (
            <div className="border-b border-gold/20 p-4 bg-gold/5 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-400">
                <div>
                  <p className="text-gold font-medium mb-2">Text</p>
                  <p><code className="text-xs bg-white/10 px-1 rounded">**bold**</code> → <strong>bold</strong></p>
                  <p><code className="text-xs bg-white/10 px-1 rounded">*italic*</code> → <em>italic</em></p>
                  <p><code className="text-xs bg-white/10 px-1 rounded">~~strike~~</code> → <s>strike</s></p>
                </div>
                <div>
                  <p className="text-gold font-medium mb-2">Headings</p>
                  <p><code className="text-xs bg-white/10 px-1 rounded"># H1</code></p>
                  <p><code className="text-xs bg-white/10 px-1 rounded">## H2</code></p>
                  <p><code className="text-xs bg-white/10 px-1 rounded">### H3</code></p>
                </div>
                <div>
                  <p className="text-gold font-medium mb-2">Lists</p>
                  <p><code className="text-xs bg-white/10 px-1 rounded">- item</code> (bullet)</p>
                  <p><code className="text-xs bg-white/10 px-1 rounded">1. item</code> (numbered)</p>
                  <p><code className="text-xs bg-white/10 px-1 rounded">- [ ] task</code> (checkbox)</p>
                </div>
                <div>
                  <p className="text-gold font-medium mb-2">Media</p>
                  <p><code className="text-xs bg-white/10 px-1 rounded">![alt](url)</code> (image)</p>
                  <p><code className="text-xs bg-white/10 px-1 rounded">[text](url)</code> (link)</p>
                  <p className="text-gold/70 mt-1">Use 📤 to upload images</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Media Picker Modal */}
          {showMediaPicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl border border-gold/30 bg-neutral-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-gold/20 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">Select Image from Media Library</h3>
                  <button
                    onClick={() => setShowMediaPicker(false)}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {loadingMedia ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 text-gold animate-spin" />
                    </div>
                  ) : mediaAssets.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                      {mediaAssets.filter(a => a.file_type?.startsWith('image/')).map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => openImageEditorFromLibrary(asset.url, asset.alt_text || asset.file_name)}
                          className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gold transition-colors"
                        >
                          <Image
                            src={asset.url}
                            alt={asset.alt_text || asset.file_name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs text-white font-medium">Edit & Insert</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileImage className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No images in media library yet.</p>
                      <p className="text-sm mt-1">Upload an image using the 📤 button in the toolbar.</p>
                    </div>
                  )}
                </div>
                <div className="border-t border-gold/20 px-6 py-4 bg-white/5">
                  <p className="text-xs text-gray-500">Click an image to open the editor where you can crop, add alt text, and preview before inserting.</p>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <textarea
            id="content"
            placeholder="Write your post content here... (Markdown supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full bg-transparent p-6 text-white placeholder-gray-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Actions */}
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6 space-y-4">
          <h3 className="font-semibold text-white">Publish</h3>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gold/30 bg-white/5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {saving && status === "draft" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-light via-gold to-gold-dark py-2.5 text-sm font-bold text-black hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50"
            >
              {saving && status === "published" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              Publish
            </button>
          </div>

          {/* Preview Button */}
          <button
            onClick={() => setShowPreview(true)}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 py-2.5 text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Preview Post
          </button>

          <Link
            href="/admin/posts"
            className="flex items-center justify-center gap-2 w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to posts
          </Link>
        </div>

        {/* Cover Image */}
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6 space-y-4">
          <h3 className="font-semibold text-white">Cover Image</h3>
          
          {coverImage ? (
            <div className="relative aspect-video rounded-lg overflow-hidden border border-gold/20">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <button
                onClick={() => setCoverImage("")}
                className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1.5 text-white hover:bg-red-500 transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gold/30 bg-white/5 cursor-pointer hover:border-gold/50 hover:bg-white/10 transition-colors">
              {uploading ? (
                <Loader2 className="h-8 w-8 text-gold animate-spin" />
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {/* Category */}
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6 space-y-4">
          <h3 className="font-semibold text-white">Category</h3>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-gold/20 bg-white/5 py-2.5 px-3 text-white focus:border-gold focus:outline-none"
          >
            <option value="" className="bg-neutral-900">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-neutral-900">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6 space-y-4">
          <h3 className="font-semibold text-white">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedTags.includes(tag.id)
                    ? "bg-gold text-black"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                {tag.name}
              </button>
            ))}
            {tags.length === 0 && (
              <p className="text-sm text-gray-500">No tags available</p>
            )}
          </div>
        </div>

        {/* Featured */}
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-5 w-5 rounded border-gold/30 bg-white/5 text-gold focus:ring-gold focus:ring-offset-0"
            />
            <div>
              <p className="font-medium text-white">Featured Post</p>
              <p className="text-xs text-gray-500">Display prominently on the blog</p>
            </div>
          </label>
        </div>
      </div>

      {/* Image Editor Modal */}
      {showImageEditor && pendingImageUrl && (
        <ImageEditor
          imageUrl={pendingImageUrl}
          initialAltText={pendingImageAlt}
          onSave={handleImageEditorSave}
          onCancel={handleImageEditorCancel}
        />
      )}

      {/* Blog Preview Modal */}
      {showPreview && (
        <BlogPreview
          title={title}
          excerpt={excerpt}
          content={content}
          coverImage={coverImage}
          categoryName={categories.find(c => c.id === categoryId)?.name}
          categoryColor={categories.find(c => c.id === categoryId)?.color || undefined}
          authorName="Bhukya Krishna"
          readingTime={calculateReadingTime(content)}
          tags={selectedTags.map(id => tags.find(t => t.id === id)?.name || "").filter(Boolean)}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
