import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate } from 'react-router-dom';
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isPast,
  addDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/**
 * Styles — minimal CSS-in-JS for a Google Tasks–like look.
 */
const styles = {
  app: {
    fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
    height: "70%",
    display: "grid",
    gridTemplateColumns: "280px 1fr 360px",
    gridTemplateRows: "56px 1fr",
    gridTemplateAreas: `
      "header header header"
      "sidebar main detail"
    `,
    // color: "#202124",
    // background: "#fff",
  },
  header: {
    gridArea: "header",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid #e0e0e0",
    gap: "12px",
  },
  headerTitle: { fontSize: "18px", fontWeight: 600 },
  sidebar: {
    gridArea: "sidebar",
    borderRight: "1px solid #e0e0e0",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  listItem: (active) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    // background: active ? "#e8f0fe" : "transparent",
  }),
  listName: { fontWeight: 500 },
  main: {
    gridArea: "main",
    padding: "16px",
    display: "grid",
    height: "100vh",
    // overflowY : "scroll",
    
    gridTemplateRows: "auto auto 1fr",
    gap: "12px",
  },
  sectionTitle: { fontSize: "16px", fontWeight: 600 },
  taskInputRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #dadce0",
    outline: "none",
  },
  dateInput: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #dadce0",
    outline: "none",
    width: "180px",
  },
  buttonPrimary: {
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 600,
  },
  buttonGhost: {
    background: "transparent",
    color: "#1a73e8",
    border: "1px solid #1a73e8",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 600,
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
    overflowY: "scroll",
    scrollbarWidth:"none",
    paddingRight: "8px",
  },
  taskItem: (selected) => ({
    display: "grid",
    gridTemplateColumns: "28px 1fr auto",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    borderRadius: "8px",
    border: selected ? "1px solid #1a73e8" : "1px solid #e0e0e0",
    background: selected ? "#f5f9ff" : "#fff",
    cursor: "pointer",
  }),
  checkbox: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "2px solid #5f6368",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  taskTitle: (completed) => ({
    fontWeight: 500,
    textDecoration: completed ? "line-through" : "none",
    color: completed ? "#5f6368" : "#202124",
  }),
  taskMeta: { fontSize: "12px", color: "#5f6368" },
  taskActions: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  detail: {
    gridArea: "detail",
    borderLeft: "1px solid #e0e0e0",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  detailCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  chartCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "12px",
    height: "240px",
  },
};

/**
 * Helpers
 */
const uid = () => Math.random().toString(36).slice(2, 10);

const todayISO = () => format(new Date(), "yyyy-MM-dd");

const formatDueLabel = (iso) => {
  if (!iso) return "No due date";
  const d = parseISO(iso);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isPast(d) && !isToday(d)) return `Overdue • ${format(d, "MMM d")}`;
  return format(d, "EEE, MMM d");
};

const loadState = () => {
  try {
    const raw = localStorage.getItem("tasks_state");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem("tasks_state", JSON.stringify(state));
  } catch {}
};

/**
 * Main App
 */
function Dashboard() {
  const [lists, setLists] = useState([
    { id: uid(), name: "My Tasks" },
  ]);
  const [activeListId, setActiveListId] = useState(lists[0].id);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const s = loadState();
    if (s) {
      setLists(s.lists || []);
      setActiveListId(s.activeListId || (s.lists?.[0]?.id ?? uid()));
      setTasks(s.tasks || []);
      setSelectedTaskId(s.selectedTaskId || null);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    saveState({ lists, activeListId, tasks, selectedTaskId });
  }, [lists, activeListId, tasks, selectedTaskId]);

  const activeList = useMemo(
    () => lists.find((l) => l.id === activeListId),
    [lists, activeListId]
  );

  const visibleTasks = useMemo(
    () => tasks.filter((t) => t.listId === activeListId),
    [tasks, activeListId]
  );

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  );

  // Read logged-in user from localStorage (signup stores lockedin_user)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('lockedin_user') || localStorage.getItem('sozo_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  // Derive initials for avatar from name or email
  const initials = useMemo(() => {
    const n = user?.name || user?.email || '';
    if (!n) return '';
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  }, [user]);

  // Stats data for Recharts: completed per day over last 14 days
  const statsData = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = addDays(startOfDay(new Date()), -13 + i);
      const key = format(d, "yyyy-MM-dd");
      const count = tasks.filter(
        (t) =>
          t.completed &&
          t.completedAt &&
          format(parseISO(t.completedAt), "yyyy-MM-dd") === key
      ).length;
      return { date: format(d, "MMM d"), count };
    });
    return days;
  }, [tasks]);

  // List actions
  const addList = () => {
    const name = prompt("List name:");
    if (!name) return;
    const newList = { id: uid(), name: name.trim() };
    setLists((prev) => [...prev, newList]);
    setActiveListId(newList.id);
  };

  const renameList = (id) => {
    const name = prompt("Rename list:");
    if (!name) return;
    setLists((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
  };

  // const deleteList = (id) => {
  //   if (!confirm("Delete this list and its tasks?")) return;
  //   setLists((prev) => prev.filter((l) => l.id !== id));
  //   setTasks((prev) => prev.filter((t) => t.listId !== id));
  //   if (activeListId === id) {
  //     const next = lists.find((l) => l.id !== id)?.id;
  //     setActiveListId(next || null);
  //     setSelectedTaskId(null);
  //   }
  // };

  // Task actions
  const addTask = (title, dueDateISO) => {
    if (!title?.trim()) return;
    const newTask = {
      id: uid(),
      listId: activeListId,
      title: title.trim(),
      notes: "",
      dueDate: dueDateISO || null,
      completed: false,
      completedAt: null,
      createdAt: todayISO(),
      order: visibleTasks.length,
    };
    setTasks((prev) => [...prev, newTask]);
    setSelectedTaskId(newTask.id);
  };

  const updateTask = (id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? todayISO() : null,
            }
          : t
      )
    );
  };

  const moveTask = (id, direction) => {
    const listTasks = tasks
      .filter((t) => t.listId === activeListId)
      .sort((a, b) => a.order - b.order);
    const idx = listTasks.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= listTasks.length) return;
    const a = listTasks[idx];
    const b = listTasks[swapIdx];
    const updated = tasks.map((t) => {
      if (t.id === a.id) return { ...t, order: b.order };
      if (t.id === b.id) return { ...t, order: a.order };
      return t;
    });
    setTasks(updated);
  };

  return (
    <div style={styles.app} className="dashboard">
      {/* Header */}
      <header style={styles.header}  className = 'dashboard-header'>
        <div style={styles.headerTitle}>Tasks</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: 'center' }}>
          <button style={styles.buttonGhost} onClick={addList}>
            + New list
          </button>
          {/* Mobile avatar: hidden on wide screens, shown on small viewports via media query below */}
          <div className="mobile-avatar" style={{ display: "none", alignItems: 'center' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#1a73e8",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
          </div>
        </div>

        {/* Scoped media query to show mobile avatar and adjust layout on small screens */}
        <style>{`@media (max-width: 760px) { .dashboard { grid-template-columns: 1fr; grid-template-rows: 56px 1fr; grid-template-areas: \"header\" \"main\"; } .dashboard-sidebar { display: none; } .mobile-avatar { display: flex !important; } .dashboard-content { grid-area: main; } .dashboard-detail { display: none; } }`}</style>
      </header>

      {/* Sidebar — Lists */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.sectionTitle}>Lists</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {lists.map((l) => (
            <div
              key={l.id}
              style={styles.listItem(l.id === activeListId)}
              onClick={() => setActiveListId(l.id)}
            >
              <span style={styles.listName}>{l.name}</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  style={styles.buttonGhost}
                  onClick={(e) => {
                    e.stopPropagation();
                    renameList(l.id);
                  }}
                >
                  Rename
                </button>
                {/* <button
                  style={styles.buttonGhost}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(l.id);
                  }}
                >
                  Delete
                </button> */}
              </div>
            </div>
          ))}
        </div>
        {/* Profile / avatar at bottom-left of sidebar */}
        <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #f1f3f4", display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1a73e8', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{initials}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 700 }}>{user?.name || user?.email || 'Guest'}</div>
            <div style={{ fontSize: 12, color: '#5f6368' }}>{user?.email || ''}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button style={styles.buttonGhost} onClick={() => { localStorage.removeItem('lockedin_user'); localStorage.removeItem('sozo_user'); navigate('/signin'); }}>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main — Task list and add form */}
      <main style={styles.main} className="dashboard-content" >
        <div style={styles.sectionTitle}>
          {activeList ? activeList.name : "No list selected"}
        </div>

        {/* Add task */}
        <AddTaskRow onAdd={addTask} />

        {/* Task list */}
        <div style={styles.taskList}>
          {visibleTasks
            .sort((a, b) => a.order - b.order)
            .map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                selected={t.id === selectedTaskId}
                onSelect={() => setSelectedTaskId(t.id)}
                onToggle={() => toggleComplete(t.id)}
                onDelete={() => deleteTask(t.id)}
                onMoveUp={() => moveTask(t.id, "up")}
                onMoveDown={() => moveTask(t.id, "down")}
              />
            ))}
          {visibleTasks.length === 0 && (
            <div style={{ color: "#5f6368" }}>No tasks yet.</div>
          )}
        </div>
      </main>

      {/* Detail pane */}
      <section style={styles.detail} className="dashboard-detail">
        <div style={styles.sectionTitle}>Details</div>
        <div style={styles.detailCard}>
          {selectedTask ? (
            <TaskDetail
              task={selectedTask}
              onUpdate={(patch) => updateTask(selectedTask.id, patch)}
              onToggle={() => toggleComplete(selectedTask.id)}
              onDelete={() => deleteTask(selectedTask.id)}
            />
          ) : (
            <div style={{ color: "#5f6368" }}>
              Select a task to view details.
            </div>
          )}
        </div>

        {/* Chart */}
        <div style={styles.chartCard}>
          <div style={styles.sectionTitle}>Completion trend (14 days)</div>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1a73e8"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

/**
 * Add task row
 */
function AddTaskRow({ onAdd }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");

  const submit = () => {
    onAdd(title, due || null);
    setTitle("");
    setDue("");
  };

  return (
    <div style={styles.taskInputRow}>
      <input
        style={styles.input}
        placeholder="Add a task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <input
        type="date"
        style={styles.dateInput}
        value={due}
        onChange={(e) => setDue(e.target.value)}
      />
      <button style={styles.buttonPrimary} onClick={submit}>
        Add
      </button>
    </div>
  );
}

/**
 * Task row
 */
function TaskRow({
  task,
  selected,
  onSelect,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}) {
  return (
    <div style={styles.taskItem(selected)} onClick={onSelect}>
      <div
        style={styles.checkbox}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        title={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed ? (
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#1a73e8",
            }}
          />
        ) : null}
      </div>

      <div>
        <div style={styles.taskTitle(task.completed)}>{task.title}</div>
        <div style={styles.taskMeta}>
          {task.dueDate ? formatDueLabel(task.dueDate) : "No due date"}
          {task.notes ? ` • ${task.notes.slice(0, 40)}…` : ""}
        </div>
      </div>

      <div style={styles.taskActions}>
        <button
          style={styles.buttonGhost}
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
        >
          ↑
        </button>
        <button
          style={styles.buttonGhost}
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
        >
          ↓
        </button>
        <button
          style={styles.buttonGhost}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/**
 * Task detail pane
 */
function TaskDetail({ task, onUpdate, onToggle, onDelete }) {
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const [due, setDue] = useState(task.dueDate || "");

  useEffect(() => {
    setTitle(task.title);
    setNotes(task.notes || "");
    setDue(task.dueDate || "");
  }, [task.id]);

  const save = () => {
    onUpdate({
      title: title.trim() || task.title,
      notes,
      dueDate: due || null,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontWeight: 600 }}>Title</label>
      <input
        style={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={save}
      />

      <label style={{ fontWeight: 600 }}>Notes</label>
      <textarea
        style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={save}
      />

      <label style={{ fontWeight: 600 }}>Due date</label>
      <input
        type="date"
        style={styles.dateInput}
        value={due || ""}
        onChange={(e) => setDue(e.target.value)}
        onBlur={save}
      />

      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <button style={styles.buttonPrimary} onClick={save}>
          Save
        </button>
        <button style={styles.buttonGhost} onClick={onToggle}>
          {task.completed ? "Mark incomplete" : "Mark complete"}
        </button>
        <button
          style={{ ...styles.buttonGhost, color: "#d93025", borderColor: "#d93025" }}
          onClick={onDelete}
        >
          Delete task
        </button>
      </div>

      <div style={{ color: "#5f6368", fontSize: "12px" }}>
        Created {format(parseISO(task.createdAt), "MMM d, yyyy")}
        {task.completedAt
          ? ` • Completed ${format(parseISO(task.completedAt), "MMM d, yyyy")}`
          : ""}
      </div>
    </div>
  );
}

/**
 * Mount
 */
export default Dashboard