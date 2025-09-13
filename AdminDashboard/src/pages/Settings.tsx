import React, { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Save,
  Moon,
  Sun,
  Edit3,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useTheme } from "../hooks/useTheme";
import axios from "axios";

interface Admin {
  adminId: number;
  adminname: string;
  email: string;
  phoneNumber: string;
}

interface SettingsState {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  language: string;
  timezone: string;
  currency: string;
}

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Admin | null>(null);

  // ✅ settings state
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    language: "english",
    timezone: "Asia/Kolkata",
    currency: "INR",
  });

  // ✅ handle settings input
  const handleInputChange = (field: keyof SettingsState, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ handle profile input
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // ✅ save profile updates
  const handleProfileUpdate = () => {
    if (formData) {
      axios
        .put(
          `https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/auth/update/${formData.adminId}`,
          formData
        )
        .then((res) => {
          setAdmin(res.data);
          setEditMode(false);
          alert("✅ Profile updated successfully");
        })
        .catch((err) => console.error("Error updating profile:", err));
    }
  };

  // ✅ password change
  const handlePasswordChange = () => {
    if (settings.newPassword !== settings.confirmPassword) {
      alert("❌ New password and confirm password do not match");
      return;
    }
    if (!settings.currentPassword) {
      alert("❌ Please enter current password");
      return;
    }

    if (!admin) {
      alert("❌ Admin not loaded");
      return;
    }

    axios
      .put(
        `https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/auth/update-password/${admin.adminId}`,
        null,
        {
          params: {
            oldPassword: settings.currentPassword,
            newPassword: settings.newPassword,
          },
        }
      )
      .then(() => {
        alert("✅ Password updated successfully");
        setSettings((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      })
      .catch((err) => {
        if (err.response?.data) {
          alert(`❌ ${err.response.data}`);
        } else {
          alert("❌ Error updating password");
        }
      });
  };

  // ✅ fetch logged-in admin details
  useEffect(() => {
    const email = localStorage.getItem("adminEmail");
    if (email) {
      axios
        .get<Admin>(
          `https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/auth/me/${email}`
        )
        .then((res) => {
          setAdmin(res.data);
          setFormData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching admin details:", err);
        });
    }
  }, []);

  if (!admin || !formData) {
    return <p className="p-4">Loading profile...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
        </div>
        <Button onClick={() => alert("✅ Settings saved successfully!")}>
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Profile Settings
            </h3>
            {!editMode && (
              <Button size="sm" onClick={() => setEditMode(true)}>
                <Edit3 className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="adminname"
                value={formData.adminname}
                onChange={handleProfileChange}
                readOnly={!editMode}
                className={`w-full p-3 border border-gray-300 rounded-lg ${
                  !editMode
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "bg-white dark:bg-gray-800"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                readOnly={!editMode}
                className={`w-full p-3 border border-gray-300 rounded-lg ${
                  !editMode
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "bg-white dark:bg-gray-800"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleProfileChange}
                readOnly={!editMode}
                className={`w-full p-3 border border-gray-300 rounded-lg ${
                  !editMode
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "bg-white dark:bg-gray-800"
                }`}
              />
            </div>

            {editMode && (
              <Button
                onClick={handleProfileUpdate}
                className="bg-green-600 text-white w-full"
              >
                Save Profile
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Bell className="h-5 w-5 mr-2 text-green-600" />
              Notification Settings
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Notifications
              </span>
              <button
                onClick={() =>
                  handleInputChange(
                    "emailNotifications",
                    !settings.emailNotifications
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SMS Notifications
              </span>
              <button
                onClick={() =>
                  handleInputChange(
                    "smsNotifications",
                    !settings.smsNotifications
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.smsNotifications
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.smsNotifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Push Notifications
              </span>
              <button
                onClick={() =>
                  handleInputChange(
                    "pushNotifications",
                    !settings.pushNotifications
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushNotifications
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushNotifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-red-600" />
              Security Settings
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={settings.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={settings.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={settings.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Confirm new password"
              />
            </div>
            <Button
              onClick={handlePasswordChange}
              variant="danger"
              className="w-full"
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2 text-purple-600" />
              App Preferences
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="english">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Mumbai">Asia/Mumbai (IST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === "dark"
                    ? "bg-purple-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
                {theme === "dark" ? (
                  <Moon className="absolute left-1 h-3 w-3 text-purple-600" />
                ) : (
                  <Sun className="absolute right-1 h-3 w-3 text-gray-400" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
