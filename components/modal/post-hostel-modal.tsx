"use client"
import { useState } from "react"
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, X, Camera } from "lucide-react"

interface PostHostelModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    hostelName: string
    price: string
    address: string
    images: File[]
  }) => void
}

export default function PostHostelModal({ isOpen, onClose, onSubmit }: PostHostelModalProps) {
  const [hostelName, setHostelName] = useState("")
  const [price, setPrice] = useState("")
  const [address, setAddress] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"))
    const validFiles = newFiles.slice(0, 6 - images.length) // Max 6 images

    const newPreviews: string[] = []

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === validFiles.length) {
          setPreviews(prev => [...prev, ...newPreviews])
          setImages(prev => [...prev, ...validFiles])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleImageUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hostelName || !price || !address) {
      alert("Please fill in all fields")
      return
    }
    if (images.length === 0) {
      alert("Please upload at least one image")
      return
    }

    onSubmit({ hostelName, price, address, images })
    // Reset form
    setHostelName("")
    setPrice("")
    setAddress("")
    setImages([])
    setPreviews([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Property Images <span className="text-red-500">*</span>
            </label>

            {previews.length === 0 ? (
              <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-muted/30"
                }`}
              >
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium text-foreground">Drop images here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">Up to 6 images (JPG, PNG)</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-3">
                {/* Main Preview */}
                {previews[0] && (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img
                      src={previews[0]}
                      alt="Main preview"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                  </div>
                )}

                {/* Thumbnails */}
                <div className="grid grid-cols-5 gap-3">
                  {previews.slice(1).map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${idx + 2}`}
                        className="w-full h-20 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx + 1)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {previews.length < 6 && (
                    <label className="h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition bg-muted/50">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Show count */}
                <p className="text-xs text-muted-foreground text-center">
                  {previews.length}/6 images uploaded
                </p>
              </div>
            )}
          </div>

          {/* Other Fields */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Property Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              placeholder="e.g., Cozy Student Hostel"
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Price per Night (₦) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 25000"
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., No. 45 Adeola Odeku, Victoria Island, Lagos"
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={images.length === 0}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Post Property
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}