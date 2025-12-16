"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadProperty } from "@/lib/uploadProperty";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, X } from "lucide-react";

type PropertyType = "homes" | "shortlets" | "hostels";

interface PropertyFormData {
  type: PropertyType;
  title: string;
  price: string;
  address: string;
  latitude: string;
  longitude: string;
  beds: string;
  baths: string;
  amenities: string;
  about: string;
  photos: File[];
}

export default function PropertyUpload() {
  const [formData, setFormData] = useState<PropertyFormData>({
    type: "homes",
    title: "",
    price: "",
    address: "",
    latitude: "",
    longitude: "",
    beds: "",
    baths: "",
    amenities: "",
    about: "",
    photos: [],
  });

  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = [...formData.photos, ...files];
    setFormData((prev) => ({
      ...prev,
      photos: newPhotos,
    }));

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPhotoPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await uploadProperty(formData);

      console.log("Property uploaded successfully:", response);
      alert(
        `Property uploaded! Title: ${response.title}, Type: ${response.type}`
      );

      // Reset form
      setFormData({
        type: "homes",
        title: "",
        price: "",
        address: "",
        latitude: "",
        longitude: "",
        beds: "",
        baths: "",
        amenities: "",
        about: "",
        photos: [],
      });
      setPhotoPreview([]);
    } catch (error: any) {
      console.error("Error uploading property:", error);
      alert(error.message || "Failed to upload property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Upload Properties
          </h1>
          <p className="text-slate-600">
            Add your homes, shortlets, or hostels to our platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(["homes", "shortlets", "hostels"] as const).map((type) => (
              <label
                key={type}
                className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.type === type
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={formData.type === type}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 capitalize">
                    {type}
                  </span>
                  <span className="text-sm text-slate-500">
                    {type === "homes" && "Residential homes"}
                    {type === "shortlets" && "Short-term rentals"}
                    {type === "hostels" && "Hostel accommodations"}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>
                Enter the basic information about your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Luxury Beachfront Villa"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Beds
                  </label>
                  <input
                    type="text"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    placeholder="e.g., 4"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="text"
                    name="baths"
                    value={formData.baths}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 40.7128"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g., -74.0060"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amenities
                </label>
                <textarea
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  placeholder="List amenities (e.g., WiFi, Pool, Air Conditioning, Gym, Kitchen, etc.)"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  About Property
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Describe your property in detail..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Photos</CardTitle>
              <CardDescription>
                Upload as many photos as you want (supports multiple uploads)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50 transition-colors"
              >
                <Upload className="mx-auto mb-2 text-blue-600" size={32} />
                <p className="font-semibold text-slate-900">
                  Click to upload photos
                </p>
                <p className="text-sm text-slate-500">or drag and drop</p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {/* Photo Grid Preview */}
              {photoPreview.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Uploaded Photos ({photoPreview.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {photoPreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              {isSubmitting ? "Uploading..." : "Submit Property"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  type: "homes",
                  title: "",
                  price: "",
                  address: "",
                  latitude: "",
                  longitude: "",
                  beds: "",
                  baths: "",
                  amenities: "",
                  about: "",
                  photos: [],
                });
                setPhotoPreview([]);
              }}
              className="px-8"
            >
              Clear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
