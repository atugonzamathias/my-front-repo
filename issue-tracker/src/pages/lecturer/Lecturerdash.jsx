import React, { useEffect, useState } from 'react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/select';
import { ArrowLeft, User } from 'lucide-react';
import Card, { CardContent } from '@/components/Cards';
import API from '../../API';
import NotificationBell from '@/components/NotificationBell';
import LogoutButton from '../../components/LogoutButton';


const LecturerDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await API.get('/api/issues/?status=assigned');
      setIssues(res.data);
      setFilteredIssues(res.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      setError(
        'Unable to fetch issues. Please check your connection or contact the admin.'
      );
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
    if (statusFilter)
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    if (typeFilter)
      filtered = filtered.filter((issue) => issue.issue_type === typeFilter);
    if (search)
      filtered = filtered.filter((issue) =>
        issue.title.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredIssues(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [statusFilter, typeFilter, search]);

  const stats = {
    total: issues.length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    pending: issues.filter((i) => i.status !== 'resolved').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top bar */}
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

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h2 className="text-xl font-semibold">Total Issues</h2>
            <p>{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h2 className="text-xl font-semibold">Resolved</h2>
            <p>{stats.resolved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h2 className="text-xl font-semibold">In Progress</h2>
            <p>{stats.in_progress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h2 className="text-xl font-semibold">Pending</h2>
            <p>{stats.pending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Status" />
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
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="missing_marks">Missing Marks</SelectItem>
            <SelectItem value="appeal">Appeal</SelectItem>
            <SelectItem value="correction">Correction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Issues Table */}
      <div className="overflow-auto">
        <table className="min-w-full text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Type</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="border-t">
                <td className="p-2">{issue.title}</td>
                <td className="p-2 capitalize">
                  {issue.issue_type.replace('_', ' ')}
                </td>
                <td className="p-2 capitalize">
                  {issue.status.replace('_', ' ')}
                </td>
                <td className="p-2 space-x-2">
                  {issue.status !== 'resolved' && (
                    <>
                      <Button
                        onClick={() =>
                          handleStatusChange(issue.id, 'in_progress')
                        }
                        variant="outline"
                        size="sm"
                      >
                        In Progress
                      </Button>
                      <Button
                        onClick={() =>
                          handleStatusChange(issue.id, 'resolved')
                        }
                        size="sm"
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LecturerDashboard;
