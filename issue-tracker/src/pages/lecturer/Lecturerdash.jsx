import React, { useEffect, useState } from 'react';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/select';
import { ArrowLeft, User } from 'lucide-react';
import Card, { CardContent } from '../../components/Cards';
import API from '../../API';
import NotificationBell from '../../components/NotificationBell';
import LogoutButton from '../../components/LogoutButton';

const LecturerDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 5;

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/issues/?status=assigned');
      const data = Array.isArray(res.data) ? res.data : [];
      setIssues(data);
      setFilteredIssues(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      setError('Unable to fetch issues. Please check your connection or contact the admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.patch(`/api/issues/${id}/`, { status: newStatus });
      fetchIssues();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...issues];
    if (statusFilter) {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }
    if (typeFilter) {
      filtered = filtered.filter((issue) => issue.issue_type === typeFilter);
    }
    if (search) {
      filtered = filtered.filter((issue) =>
        issue.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredIssues(filtered);
  };

  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset page when filters change
  }, [statusFilter, typeFilter, search]);

  const stats = {
    total: issues.length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    pending: issues.filter((i) => i.status !== 'resolved').length,
  };

  // Pagination
  const indexOfLast = currentPage * issuesPerPage;
  const indexOfFirst = indexOfLast - issuesPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);

  return (
    <div className="p-6 space-y-8 bg-white dark:bg-gray-950 min-h-screen">
      {/* Topbar */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-4">
          <NotificationBell />
          <LogoutButton />
          <Button
            variant="ghost"
            onClick={() => (window.location.href = '/profile')}
          >
            <User />
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md shadow-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <Card className="w-full">
          <CardContent className="p-4 text-center">
            <h2 className="text-sm font-medium text-muted-foreground">Total Issues</h2>
            <p className="text-2xl font-semibold text-primary">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-4 text-center">
            <h2 className="text-sm font-medium text-muted-foreground">Resolved</h2>
            <p className="text-2xl font-semibold text-green-600">{stats.resolved}</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-4 text-center">
            <h2 className="text-sm font-medium text-muted-foreground">In Progress</h2>
            <p className="text-2xl font-semibold text-yellow-500">{stats.in_progress}</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-4 text-center">
            <h2 className="text-sm font-medium text-muted-foreground">Pending</h2>
            <p className="text-2xl font-semibold text-orange-500">{stats.pending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-60"
        />
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setTypeFilter} value={typeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="missing_marks">Missing Marks</SelectItem>
            <SelectItem value="appeal">Appeal</SelectItem>
            <SelectItem value="correction">Correction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-10 w-10 rounded-full border-t-4 border-b-4 border-blue-500" />
        </div>
      )}

      {/* Issues Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-md text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentIssues.length > 0 ? (
                currentIssues.map((issue) => (
                  <tr key={issue.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-3">{issue.title}</td>
                    <td className="p-3 capitalize">{issue.issue_type.replace('_', ' ')}</td>
                    <td className="p-3 capitalize">{issue.status.replace('_', ' ')}</td>
                    <td className="p-3 space-x-2">
                      {issue.status !== 'resolved' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(issue.id, 'in_progress')}
                          >
                            In Progress
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(issue.id, 'resolved')}
                          >
                            Resolve
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-muted-foreground">
                    No issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
