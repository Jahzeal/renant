    "use client";

    import { useState, useEffect } from "react";
    import { X, Upload } from "lucide-react";

    type PropertyType = "homes" | "shortlets" | "hostels";

    interface EditListingModalProps {
    listing: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedListing: any) => void;
    }

    export default function EditListingModal({
    listing,
    isOpen,
    onClose,
    onSave,
    }: EditListingModalProps) {
    // Syncing the state with the PropertyFormData structure from your upload page
    const [formData, setFormData] = useState({
        type: "homes" as PropertyType,
        title: "",
        price: "",
        address: "",
        latitude: "",
        longitude: "",
        beds: "",
        baths: "",
        offers: "",
        amenities: "",
        about: "", // mapped to description if necessary
        ...listing,
    });

    useEffect(() => {
        if (isOpen && listing) {
        // This creates a clean object where every null/undefined value is an empty string
        const cleanData = Object.keys(listing).reduce((acc, key) => {
            acc[key] = listing[key] ?? "";
            return acc;
        }, {} as any);

        setFormData(cleanData);
        }
    }, [isOpen, listing]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity"
        onClick={onClose}
        >
        <div
            className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Property</h2>
                <p className="text-xs text-slate-500">
                Modify property details and location
                </p>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
                <X size={20} className="text-slate-500" />
            </button>
            </div>

            {/* Scrollable Form */}
            <form
            onSubmit={handleSave}
            className="overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
            {/* Property Type Radio Group */}
            <div className="grid grid-cols-3 gap-3">
                {(["APARTMENT", "ShortLET", "HOSTELS"] as const).map((type) => (
                <label
                    key={type}
                    className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.type === type
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-100 hover:border-blue-200"
                    }`}
                >
                    <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                    className="sr-only"
                    />
                    <span className="text-sm font-bold capitalize">{type}</span>
                </label>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                    Property Title
                </label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="e.g. Luxury Beachfront Villa"
                />
                </div>

                {/* Price & Offers */}
                <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                    Price
                </label>
                <input
                    name="price"
                    type="text"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                </div>
                <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                    Offers
                </label>
                <input
                    name="offers"
                    value={formData.offers}
                    onChange={handleChange}
                    placeholder="e.g. 10% Off"
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                    Full Address
                </label>
                <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                </div>

                {/* Coordinates */}
                <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                    Latitude
                </label>
                <input
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                </div>
                <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                    Longitude
                </label>
                <input
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                </div>

                {/* Details */}
                <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                    Beds
                </label>
                <input
                    name="beds"
                    value={formData.beds}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                </div>
                <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                    Baths
                </label>
                <input
                    name="baths"
                    value={formData.baths}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                </div>

                {/* Amenities & About */}
                <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                    Amenities
                </label>
                <textarea
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                />
                </div>

                <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                    About Property
                </label>
                <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                />
                </div>
            </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t flex items-center justify-end gap-3">
            <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
                Save Changes
            </button>
            </div>
        </div>
        </div>
    );
    }
