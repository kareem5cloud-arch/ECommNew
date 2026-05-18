"use client";
import { useState, useRef } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Code,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";

export default function AccountSettings() {
  const [profileImage, setProfileImage] = useState("/user-avatar.png");
  const [formData, setFormData] = useState({
    fullName: "John Snow",
    email: "Jhon@example.com",
    password: "",
    newPassword: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your account settings have been updated!");
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <User className="w-7 h-7 text-indigo-600" /> Account Settings
      </h1>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 max-w-3xl mx-auto">
        {/* === PROFILE IMAGE SECTION === */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-md bg-gray-50">
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-black z-50 text-white p-2 rounded-full hover:bg-gray-800 transition"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <p className="mt-3 text-gray-700 font-semibold text-lg">
            {formData.fullName}
          </p>
          <p className="text-sm text-gray-500">{formData.email}</p>
        </div>

        {/* === FORM SECTION === */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                <User className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-900"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                <Mail className="text-gray-400 mr-2" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-900"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                City
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                <MapPin className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="fullName"
                  className="w-full bg-transparent outline-none text-gray-900"
                  placeholder="City"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Street No
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                <Code className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="email"
                  className="w-full bg-transparent outline-none text-gray-900"
                  placeholder="Street No"
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Postal Code
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                <Code className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="email"
                  className="w-full bg-transparent outline-none text-gray-900"
                  placeholder="Postal Code"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone No
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                <Phone className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="fullName"
                  className="w-full bg-transparent outline-none text-gray-900"
                  placeholder="Phone No"
                />
              </div>
            </div>

            {/* Email */}
          </div>

          {/* Password Section */}
          {/* <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Current Password
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                <Lock className="text-gray-400 mr-2" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-900"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                <Lock className="text-gray-400 mr-2" size={18} />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-900"
                  placeholder="Enter new password"
                />
              </div>
            </div>
          </div> */}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition"
            >
              <Save size={18} /> Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
