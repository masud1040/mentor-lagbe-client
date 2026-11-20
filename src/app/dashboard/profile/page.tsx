"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  fetchMyProfileApi,
  updateMyProfileApi,
  ProfileUpdatePayload,
} from "@/lib/api/user-api";
import { uploadImageToImgBB } from "@/lib/api/imgbb";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  Edit3,
  Save,
  X,
  Plus,
  Loader2,
  School,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Camera,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: "student" | "mentor" | "admin";
  bio?: string;
  gender?: string;
  location?: string;
  education?: string;
  currentOccupation?: string;
  cvUrl?: string;
  expertSubjects?: string[];
  isPremium?: boolean;
  studentClass?: string;
  institution?: string;
}

const PRESET_SUBJECTS = [
  "Mathematics",
  "Higher Math",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "English",
  "Bangla",
  "Accounting",
  "Finance",
  "Economics",
  "General Science",
];

const inputClass =
  "h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 transition-all hover:border-slate-300 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-600";

export default function DashboardProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");

  const [education, setEducation] = useState("");
  const [currentOccupation, setCurrentOccupation] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [expertSubjects, setExpertSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");

  const [studentClass, setStudentClass] = useState("");
  const [institution, setInstitution] = useState("");

  const syncFormWithProfile = (data: UserProfile) => {
    setName(data.name || "");
    setPhone(data.phone || "");
    setImage(data.image || "");
    setBio(data.bio || "");
    setGender(data.gender || "");
    setLocation(data.location || "");
    setEducation(data.education || "");
    setCurrentOccupation(data.currentOccupation || "");
    setCvUrl(data.cvUrl || "");
    setExpertSubjects(Array.isArray(data.expertSubjects) ? data.expertSubjects : []);
    setStudentClass(data.studentClass || "");
    setInstitution(data.institution || "");
    setImgError(false);
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await fetchMyProfileApi();
        setProfile(data);
        syncFormWithProfile(data);
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadImageToImgBB(file);
      setImage(uploadedUrl);
      setImgError(false);
      toast.success("Profile photo uploaded!");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to upload photo.";
      toast.error(msg);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleSubject = (subject: string) => {
    setExpertSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleAddCustomSubject = () => {
    const trimmed = customSubject.trim();
    if (!trimmed) return;
    if (expertSubjects.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Subject already added.");
      return;
    }
    setExpertSubjects((prev) => [...prev, trimmed]);
    setCustomSubject("");
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    if (uploadingImage) {
      toast.error("Please wait for the photo upload to finish.");
      return;
    }

    setSaving(true);
    const payload: ProfileUpdatePayload = {
      name: name.trim(),
      phone: phone.trim(),
      image: image.trim(),
      bio: bio.trim(),
      gender,
      location: location.trim(),
    };

    if (profile.role === "mentor") {
      payload.education = education.trim();
      payload.currentOccupation = currentOccupation.trim();
      payload.cvUrl = cvUrl.trim();
      payload.expertSubjects = expertSubjects;
    } else if (profile.role === "student") {
      payload.studentClass = studentClass.trim();
      payload.institution = institution.trim();
    }

    try {
      const { ok, data } = await updateMyProfileApi(payload);
      if (ok && data.success) {
        setProfile(data.user);
        syncFormWithProfile(data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-28">
        <Loader2 className="size-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/80 bg-white p-10 text-center">
        <p className="text-sm font-semibold text-slate-600">
          Unable to load profile details.
        </p>
      </div>
    );
  }

  const avatarInitial = (name || profile.name || "U").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {profile.image && !imgError ? (
              <img
                src={profile.image}
                alt={profile.name}
                onError={() => setImgError(true)}
                className="size-16 shrink-0 rounded-2xl border border-slate-200 object-cover sm:size-20"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-extrabold text-white sm:size-20">
                {avatarInitial}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {profile.name}
                </h1>
                <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  {profile.role}
                </span>
                {profile.isPremium && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    <Sparkles className="size-3" /> Pro
                  </span>
                )}
              </div>

              <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-slate-500">
                <Mail className="size-3.5 shrink-0 text-slate-400" />
                {profile.email}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                {profile.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="size-3.5 text-slate-400" />
                    {profile.phone}
                  </span>
                )}
                {profile.gender && (
                  <span className="capitalize">Gender: {profile.gender}</span>
                )}
                {profile.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 text-slate-400" />
                    {profile.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-10 shrink-0 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-blue-600"
            >
              <Edit3 className="mr-1.5 size-4" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7">
            <h2 className="text-base font-bold text-slate-900">About / Bio</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {profile.bio ||
                "No bio added yet. Click 'Edit Profile' to introduce yourself."}
            </p>
          </div>

          {profile.role === "mentor" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7">
              <h2 className="text-base font-bold text-slate-900">
                Academic &amp; Teaching Details
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <GraduationCap className="size-4 text-blue-600" />
                    Education / Institution
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {profile.education || "Not specified"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <Briefcase className="size-4 text-blue-600" />
                    Current Occupation
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {profile.currentOccupation || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Expert Subjects
                </p>
                {profile.expertSubjects && profile.expertSubjects.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {profile.expertSubjects.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                      >
                        <CheckCircle2 className="size-3.5" />
                        {sub}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1.5 text-sm text-slate-500">
                    No subjects selected yet.
                  </p>
                )}
              </div>

              {profile.cvUrl && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <FileText className="size-4 text-blue-600" />
                    View Attached CV / Resume
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {profile.role === "student" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7">
              <h2 className="text-base font-bold text-slate-900">
                Academic Information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <BookOpen className="size-4 text-blue-600" />
                    Class / Level
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {profile.studentClass || "Not specified"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <School className="size-4 text-blue-600" />
                    School / College
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {profile.institution || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
              <p className="text-xs text-slate-500">
                Update your personal details and profile photo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                syncFormWithProfile(profile);
                setIsEditing(false);
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative size-16 shrink-0">
                {image ? (
                  <img
                    src={image}
                    alt={name || "Profile"}
                    className="size-16 rounded-2xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-extrabold text-white">
                    {avatarInitial}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 rounded-xl border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-1.5 size-3.5 text-blue-600" />
                        {image ? "Change Photo" : "Upload Photo"}
                      </>
                    )}
                  </Button>

                  {image && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setImage("")}
                      className="h-9 rounded-xl px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="image"
                    type="url"
                    placeholder="Or paste an image URL (https://i.ibb.co/...)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="h-9 rounded-xl border-slate-200 bg-white pl-8 text-xs text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className={labelClass}>
                Full Name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className={labelClass}>
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender" className={labelClass}>
                Gender
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender" className={`${inputClass} w-full`}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className={labelClass}>
                Location / Area
              </Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="location"
                  placeholder="e.g. GEC Circle, Chattogram"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className={labelClass}>
              Short Bio
            </Label>
            <Textarea
              id="bio"
              rows={3}
              placeholder="Write a brief introduction about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="resize-none rounded-xl border border-slate-200/90 bg-white p-3.5 text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 transition-all hover:border-slate-300 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10"
            />
          </div>

          {profile.role === "mentor" && (
            <div className="space-y-5 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-900">
                Mentor Qualifications &amp; Expertise
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="education" className={labelClass}>
                    Education / Institution
                  </Label>
                  <Input
                    id="education"
                    placeholder="e.g. BSc in CSE, DUET"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="occupation" className={labelClass}>
                    Current Occupation
                  </Label>
                  <Input
                    id="occupation"
                    placeholder="e.g. Undergraduate Student / Developer"
                    value={currentOccupation}
                    onChange={(e) => setCurrentOccupation(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cvUrl" className={labelClass}>
                  CV / Resume Link (Optional)
                </Label>
                <Input
                  id="cvUrl"
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2.5">
                <Label className={labelClass}>
                  Expert Subjects (Select or add custom)
                </Label>

                {expertSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                    {expertSubjects.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        {sub}
                        <button
                          type="button"
                          onClick={() => toggleSubject(sub)}
                          className="rounded hover:bg-blue-700"
                        >
                          <X className="size-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SUBJECTS.map((sub) => {
                    const selected = expertSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                          selected
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {selected ? "✓ " : "+ "}
                        {sub}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-1">
                  <Input
                    type="text"
                    placeholder="Add custom subject (e.g. Spoken English, IELTS, C++)"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomSubject();
                      }
                    }}
                    className={inputClass}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomSubject}
                    className="h-11 shrink-0 rounded-xl border-slate-200 px-4 text-xs font-bold"
                  >
                    <Plus className="mr-1 size-4" /> Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {profile.role === "student" && (
            <div className="space-y-4 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-900">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="studentClass" className={labelClass}>
                    Current Class / Level
                  </Label>
                  <Input
                    id="studentClass"
                    placeholder="e.g. Class 10 / HSC 1st Year"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="institution" className={labelClass}>
                    School / College Name
                  </Label>
                  <Input
                    id="institution"
                    placeholder="e.g. Notre Dame College"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
            <Button
              type="submit"
              disabled={saving || uploadingImage}
              className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-blue-600"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-1.5 size-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-1.5 size-4" /> Save Profile
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                syncFormWithProfile(profile);
                setIsEditing(false);
              }}
              className="h-11 rounded-xl border-slate-200 px-5 text-sm font-semibold"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}