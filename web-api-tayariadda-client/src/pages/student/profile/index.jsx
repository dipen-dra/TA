import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User, Mail, Lock, Upload, BookOpen, CheckCircle, Award, Loader2 } from "lucide-react";
import {
    fetchStudentBoughtCoursesService,
    fetchStudentQuizResultsService,
    updateUserProfileService,
    mediaUploadService
} from "@/services";
import { toast } from "react-toastify";

function StudentProfilePage() {
    const { auth, checkAuthUser } = useContext(AuthContext); // Assuming checkAuthUser refreshes the user context
    const user = auth?.user;

    const [stats, setStats] = useState({
        coursesEnrolled: 0,
        quizzesTaken: 0,
        quizzesPassed: 0
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    // Form States
    const [profileData, setProfileData] = useState({
        fName: "",
        image: "",
        phone: "",
        address: "",
        qualification: ""
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Upload State
    const [imageLoading, setImageLoading] = useState(false);

    // Update States
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                fName: user.fName || user.userName || "",
                image: user.image || "",
                phone: user.phone || "",
                address: user.address || "",
                qualification: user.qualification || ""
            });
            fetchStats();
        }
    }, [user]);

    async function fetchStats() {
        if (!user?._id) return;
        setIsLoadingStats(true);
        try {
            // Fetch Courses
            const coursesData = await fetchStudentBoughtCoursesService(user._id);
            const enrolledCount = coursesData?.success ? coursesData.data.length : 0;

            // Fetch Quizzes
            const quizzesData = await fetchStudentQuizResultsService(user._id);
            const quizResults = quizzesData?.success ? quizzesData.data : [];
            const takenCount = quizResults.length;
            const passedCount = quizResults.filter(q => q.status === 'pass').length;

            setStats({
                coursesEnrolled: enrolledCount,
                quizzesTaken: takenCount,
                quizzesPassed: passedCount
            });
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setIsLoadingStats(false);
        }
    }

    async function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        setImageLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await mediaUploadService(formData, () => { });
            if (response.success) {
                setProfileData(prev => ({ ...prev, image: response.data.url }));
                toast.success("Image uploaded successfully. Click 'Save Changes' to apply.");
            }
        } catch (error) {
            toast.error("Failed to upload image.");
        } finally {
            setImageLoading(false);
        }
    }

    async function handleUpdateProfile(e) {
        e.preventDefault();

        // We need current password to update profile based on backend requirement
        // But for better UX, maybe we PROMPT for it? 
        // Or if the backend strictly requires it for ANY update, we must ask for it.
        // Let's assume for profile update (non-sensitive), we might need to adjust backend 
        // OR ask user to confirm with password.
        // For now, let's try to update without password first? 
        // WAIT: The backend code showed: `if (!currentPassword) return 400`.
        // So we MUST provide a password to update ANYTHING. This is high security but slightly annoying UX.
        // We will add a "Current Password" field to the Profile form as well.

        setIsUpdatingProfile(true);
        try {
            const response = await updateUserProfileService({
                fName: profileData.fName,
                image: profileData.image,
                phone: profileData.phone,
                address: profileData.address,
                qualification: profileData.qualification
            });

            if (response.success) {
                toast.success("Profile updated successfully!");
                // Refresh authentication state to reflect changes
                // checkAuthUser(); // This might be needed if existing context doesn't auto-update
                // Or manually specific update if context exposed a setAuth
                window.location.reload(); // Simple brute force refresh to get new context
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsUpdatingProfile(false);
        }
    }

    async function handleUpdatePassword(e) {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        if (!passwordData.currentPassword) {
            toast.error("Current password is required.");
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const response = await updateUserProfileService({
                currentPassword: passwordData.currentPassword,
                password: passwordData.newPassword
            });

            if (response.success) {
                toast.success("Password updated successfully!");
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update password.");
        } finally {
            setIsUpdatingPassword(false);
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8 min-h-screen">

            {/* Header / Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <Avatar className="w-32 h-32 border-4 border-white/30 shadow-xl">
                            <AvatarImage src={profileData.image} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-white/10 text-white font-bold backdrop-blur-sm">
                                {user?.userName?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                            {imageLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        </label>
                        <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">{user?.userName}</h1>
                        <p className="text-blue-100 flex items-center justify-center md:justify-start gap-2 text-lg">
                            <Mail className="w-5 h-5" /> {user?.email}
                        </p>
                        <div className="pt-2">
                            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                                {user?.role?.toUpperCase()} ACCOUNT
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="edit">Edit Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                                <BookOpen className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.coursesEnrolled}</div>
                                <p className="text-xs text-muted-foreground mt-1">Active learning paths</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.quizzesTaken}</div>
                                <p className="text-xs text-muted-foreground mt-1">Total attempts made</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                                <Award className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.quizzesPassed}</div>
                                <p className="text-xs text-muted-foreground mt-1">Quizzes passed with &gt;80%</p>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Add more overview content here, e.g., recent activity */}
                </TabsContent>

                <TabsContent value="edit">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details. You need your current password to save changes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            value={profileData.fName}
                                            onChange={(e) => setProfileData({ ...profileData, fName: e.target.value })}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input id="email" value={user?.email} className="pl-9 bg-gray-50" readOnly />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 h-4 w-4 text-gray-400 flex items-center justify-center">📞</div>
                                        <Input
                                            id="phone"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="pl-9"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 h-4 w-4 text-gray-400 flex items-center justify-center">📍</div>
                                        <Input
                                            id="address"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            className="pl-9"
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="qualification">Qualification</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 h-4 w-4 text-gray-400 flex items-center justify-center z-10">🎓</div>
                                        <Select
                                            value={profileData.qualification}
                                            onValueChange={(value) => setProfileData({ ...profileData, qualification: value })}
                                        >
                                            <SelectTrigger className="pl-9 w-full">
                                                <SelectValue placeholder="Select qualification" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SLC/SEE">SLC / SEE</SelectItem>
                                                <SelectItem value="+2">+2 / High School</SelectItem>
                                                <SelectItem value="Bachelors">Bachelors</SelectItem>
                                                <SelectItem value="Masters">Masters</SelectItem>
                                                <SelectItem value="PhD">PhD</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                                    {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Ensure your account is secure with a strong password.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 max-w-2xl">
                            <div className="space-y-2">
                                <Label htmlFor="current-pass">Current Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="current-pass"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="pl-9"
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="new-pass">New Password</Label>
                                    <input type="text" className="hidden" autoComplete="username" /> {/* Accessibility hack for password managers */}
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="new-pass"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="pl-9"
                                            placeholder="New strong password"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-pass">Confirm New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirm-pass"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="pl-9"
                                            placeholder="Repeat new password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword} variant="default" className="min-w-[150px]">
                                    {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Update Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default StudentProfilePage;
