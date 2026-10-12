import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Trash2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { studentsApi } from '../services/studentsApi';
import Modal from '../components/Modal';

export default function StudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentsApi.getStudents({
        search: search || undefined,
        group_name: groupFilter || undefined,
        limit: 100
      });
      setStudents(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [groupFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await studentsApi.deleteStudent(studentToDelete.id);
      setDeleteModalOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch {
      alert("Failed to delete student.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Employees
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Total {total} members enrolled in the face attendance system
          </p>
        </div>

        <button
          onClick={() => navigate('/students/register')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name or ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="">All Classes</option>
            <option value="CS-21">CS-21</option>
            <option value="SE-102">SE-102</option>
            <option value="DS-301">DS-301</option>
            <option value="10A">10A</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-6">Student ID</th>
                <th className="py-3.5 px-6">Class</th>
                <th className="py-3.5 px-6">Attendance</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Loading students...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={student.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.student_id}`}
                        alt={student.full_name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {student.full_name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Enrolled Student
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {student.student_id}
                    </td>
                    <td className="py-4 px-6 font-semibold text-xs text-slate-700 dark:text-slate-300">
                      {student.group_name}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 w-36">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            style={{ width: `${student.attendance_rate || 0}%` }}
                            className="h-full rounded-full bg-blue-600"
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                          {student.attendance_rate || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/students/${student.student_id}`)}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setStudentToDelete(student);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Student"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete <strong>{studentToDelete?.full_name}</strong> ({studentToDelete?.student_id})? This will also remove their biometric face encodings from the database.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
