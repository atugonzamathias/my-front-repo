import Model from "../../components/model";
import {
  Search,
  CheckCircle,
  Clock,
  Users,
  FileText,
  User
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import BackArrow from '../../components/BackArrow';
import NotificationBell from '../../components/NotificationBell';
import API from "../../API/";

const AcademicRegistrarDashboard = () => {
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    in_progress: 0,
    resolved: 0
  });

  const fetchIssues = async () => {
    try {
      const params = {};
      if (statusFilter !== "All Statuses") params.status = statusFilter;
      if (typeFilter !== "All Types") params.issue_type = typeFilter;
      if (searchQuery) params.search = searchQuery;
      const response = await API.get("/api/issues/", { params });
      setAllIssues(response.data.results);
      setFilteredIssues(response.data.results);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await API.get("/api/issues/statistics");
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleResolve = async (issueId) => {
    try {
      await API.patch(`/api/issues/${issueId}/resolve/`);
      await fetchIssues();
      await fetchStatistics();
      setSelectedIssueId(null);
    } catch (error) {
      console.error("Failed to resolve issue:", error);
      alert("Failed to resolve issue");
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [statusFilter, typeFilter, searchQuery]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const handleReset = () => {
    setStatusFilter("All Statuses");
    setTypeFilter("All Types");
    setSearchQuery("");
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case "Missing Marks":
        return "bg-red-100 text-red-800";
      case "Appeals":
        return "bg-blue-100 text-blue-800";
      case "Corrections":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Ensure filteredIssues is always an array
  const issuesArray = Array.isArray(filteredIssues)
    ? filteredIssues 
    : Object.values(filteredIssues ?? {}); // Use empty object if null/undefined

  return (
    <div className="m-2">
      <BackArrow />
      <NotificationBell />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-blue-950 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Academic Registrar Dashboard
              </h1>
              <p className="text-sm text-gray-300">
                Manage and resolve student academic issues
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/profile">
                <button className="p-2">
                  <span className="sr-only">Profile</span>
                  <User size={24} className="text-white" />
                </button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-gray-700">
                  {statistics.total}
                </div>
                <div className="text-gray-400">
                  <CheckCircle size={24} />
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">Total Issues</div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-gray-700">
                  {statistics.pending}
                </div>
                <div className="text-gray-400">
                  <Clock size={24} />
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">Pending Issues</div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-gray-700">
                  {statistics.assigned}
                </div>
                <div className="text-gray-400">
                  <Users size={24} />
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">Assigned Issues</div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-gray-700">
                  {statistics.in_progress}
                </div>
                <div className="text-gray-400">
                  <FileText size={24} />
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">In_progress Issues</div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-gray-700">
                  {statistics.resolved}
                </div>
                <div className="text-gray-400">
                  <FileText size={24} />
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">Resolved Issues</div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-blue-950 rounded-lg shadow mb-8 p-6">
            <h2 className="text-lg font-medium text-white mb-4">Filter Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Status</label>
                <select
                  className="w-full border border-gray-300 bg-gray-300 rounded-md px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Statuses</option>
                  <option>Submitted</option>
                  <option>Pending</option>
                  <option>Assigned</option>
                  <option>Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Issue Type</label>
                <select
                  className="w-full border border-gray-300 bg-gray-300 rounded-md px-3 py-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option>All Types</option>
                  <option>Missing Marks</option>
                  <option>Appeal</option>
                  <option>Correction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by student name, ID, or subject..."
                    className="w-full border border-gray-300 bg-white rounded-md pl-10 pr-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-950">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">ISSUE_TYPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">STATUS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Assigned</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {issuesArray.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{issue.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{issue.student}</div>
                        <div className="text-sm text-gray-500">{issue.student.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{issue.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getBadgeClass(issue.ISSUE_TYPE)}`}>
                          {issue.issue_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{issue.status}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{issue.created_at}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{issue.assigned_to || "Not Assigned"}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="btn bg-gray-500 hover:bg-indigo-600 text-white p-2 rounded-2xl"
                          onClick={() => setSelectedIssueId(issue.id)}
                        >
                          Mark as Resolved
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AcademicRegistrarDashboard;
