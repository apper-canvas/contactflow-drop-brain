import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import TaskForm from "@/components/organisms/TaskForm";
import { tasksService } from "@/services/api/tasksService";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setError("Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.Name || task.subject_c}"?`)) {
      return;
    }

    try {
      const success = await tasksService.delete(task.Id);
      if (success) {
        toast.success("Task deleted successfully!");
        setTasks(prev => prev.filter(t => t.Id !== task.Id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

const handleSaveTask = async (taskData) => {
    try {
      console.log("HandleSaveTask called with:", taskData);
      
      if (editingTask) {
        const updatedTask = await tasksService.update(editingTask.Id, taskData);
        if (updatedTask) {
          setTasks(prev => prev.map(t => t.Id === editingTask.Id ? updatedTask : t));
          toast.success("Task updated successfully!");
          return true;
        } else {
          toast.error("Failed to update task");
          return false;
        }
      } else {
        const newTask = await tasksService.create(taskData);
        console.log("New task created:", newTask);
        if (newTask) {
          setTasks(prev => [newTask, ...prev]);
          toast.success("Task created successfully!");
          return true;
        } else {
          toast.error("Failed to create task");
          return false;
        }
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("An error occurred while saving the task");
      return false;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const searchMatch = !searchTerm || 
      (task.Name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.subject_c || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.Tags || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = !statusFilter || task.status_c === statusFilter;
    const priorityMatch = !priorityFilter || task.priority_c === priorityFilter;
    
    return searchMatch && statusMatch && priorityMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-50";
      case "In Progress":
        return "text-blue-600 bg-blue-50";
      case "Deferred":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-orange-600 bg-orange-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    try {
      return format(parseISO(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
          <p className="text-slate-600 mt-1">
            Manage your calls, meetings, follow-ups, and notes
          </p>
        </div>
        <Button onClick={handleCreateTask} variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Deferred">Deferred</option>
            </Select>
          </div>
          <div>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </Select>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-slate-600">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description="Get started by creating your first task"
          action={
            <Button onClick={handleCreateTask} variant="primary">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {task.Name || task.subject_c || "Untitled Task"}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status_c)}`}>
                            {task.status_c || "Not Started"}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority_c)}`}>
                            {task.priority_c || "Medium"}
                          </span>
                        </div>
                      </div>

                      {task.subject_c && task.subject_c !== task.Name && (
                        <p className="text-slate-600">{task.subject_c}</p>
                      )}

                      {task.due_date_c && (
                        <div className="flex items-center text-sm text-slate-500">
                          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                          Due: {formatDate(task.due_date_c)}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {task.company_id_c?.Name && (
                          <div className="flex items-center text-slate-600">
                            <ApperIcon name="Building2" className="w-4 h-4 mr-2" />
                            <span>Company: {task.company_id_c.Name}</span>
                          </div>
                        )}
                        {task.contact_id_c?.Name && (
                          <div className="flex items-center text-slate-600">
                            <ApperIcon name="User" className="w-4 h-4 mr-2" />
                            <span>Contact: {task.contact_id_c.Name}</span>
                          </div>
                        )}
                      </div>

                      {(task.call_details_c || task.meeting_details_c || task.notes_c) && (
                        <div className="space-y-2 text-sm text-slate-600">
                          {task.call_details_c && (
                            <div className="flex items-start">
                              <ApperIcon name="Phone" className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Call: {task.call_details_c.substring(0, 100)}{task.call_details_c.length > 100 ? "..." : ""}</span>
                            </div>
                          )}
                          {task.meeting_details_c && (
                            <div className="flex items-start">
                              <ApperIcon name="Users" className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Meeting: {task.meeting_details_c.substring(0, 100)}{task.meeting_details_c.length > 100 ? "..." : ""}</span>
                            </div>
                          )}
                          {task.notes_c && (
                            <div className="flex items-start">
                              <ApperIcon name="FileText" className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Notes: {task.notes_c.substring(0, 100)}{task.notes_c.length > 100 ? "..." : ""}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {task.follow_up_c && (
                        <div className="flex items-center text-sm text-amber-600">
                          <ApperIcon name="Flag" className="w-4 h-4 mr-1" />
                          Requires follow-up
                        </div>
                      )}

                      {task.Tags && (
                        <div className="flex flex-wrap gap-1">
                          {task.Tags.split(",").map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default TasksPage;