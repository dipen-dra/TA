import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, TrendingUp, BookOpen } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { useContext, useEffect, useState } from "react";
import { fetchInstructorDashboardAnalyticsService } from "@/services";
import { AuthContext } from "@/context/auth-context";

function InstructorDashboard() {
  const { auth } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    studentList: [],
    monthlyRevenue: [],
    courseDistribution: [],
    studentGrowth: 0,
    revenueGrowth: 0,
    totalCourses: 0,
    courseGrowth: 0
  });

  useEffect(() => {
    async function fetchDashboardAnalytics() {
      if (auth?.user?._id) {
        const response = await fetchInstructorDashboardAnalyticsService(auth.user._id);
        if (response?.success) {
          setDashboardData(response.data);
        }
      }
    }
    fetchDashboardAnalytics();
  }, [auth?.user?._id]);

  const { totalRevenue, totalStudents, studentList, monthlyRevenue, courseDistribution, revenueGrowth, studentGrowth, totalCourses, courseGrowth } = dashboardData;

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: studentGrowth || 0
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `Rs. ${totalRevenue}`,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: revenueGrowth || 0
    },
    {
      icon: BookOpen,
      label: "Total Courses",
      value: totalCourses,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: courseGrowth || 0
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {config.map((item, index) => (
          <Card key={index} className="bg-white shadow-lg border-none rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {item.label}
              </CardTitle>
              <div className={`p-3 rounded-full ${item.bg}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {item.value}
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                {item.trend !== undefined && item.trend !== 0 ? (
                  <span className={`${item.trend > 0 ? 'text-green-500' : 'text-red-500'} font-bold`}>
                    {item.trend > 0 ? '↑' : '↓'} {Math.abs(item.trend)}%
                  </span>
                ) : (
                  <span className="text-gray-400 font-bold">- 0%</span>
                )}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white shadow-lg border-none rounded-2xl p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle className="text-xl font-bold text-gray-800">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full p-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1f2937' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-none rounded-2xl p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle className="text-xl font-bold text-gray-800">Student Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full p-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="students" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Students List Table */}
      <Card className="bg-white shadow-lg border-none rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
            <span>Recent Enrollments</span>
            <span className="text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              Total: {studentList.length} recent
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</TableHead>
                  <TableHead className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course Enrolled</TableHead>
                  <TableHead className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</TableHead>
                  <TableHead className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {studentList.length > 0 ? (
                  studentList.map((studentItem, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-blue-50/50 transition-colors duration-200 group cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs overflow-hidden">
                            {studentItem.studentImage ? (
                              <img src={studentItem.studentImage} alt={studentItem.studentName} className="w-full h-full object-cover" />
                            ) : (
                              <span>{studentItem.studentName ? studentItem.studentName.charAt(0) : "S"}</span>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-blue-700">{studentItem.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-600 font-medium">
                        {studentItem.courseTitle}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-500 font-mono text-sm">
                        {studentItem.studentEmail}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-500 font-mono text-sm">
                        {studentItem.date ? new Date(studentItem.date).toLocaleDateString() : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4" className="p-8 text-center text-gray-400 italic">
                      No recent enrollments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
