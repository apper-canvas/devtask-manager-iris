import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import Dashboard from "@/components/pages/Dashboard";
import Layout from "@/components/organisms/Layout";
import Error from "@/components/ui/Error";
import KeyboardShortcuts from "@/components/molecules/KeyboardShortcuts";

// Create context for keyboard shortcuts
const KeyboardShortcutContext = createContext();

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutProvider');
  }
  return context;
};

const KeyboardShortcutProvider = ({ children }) => {
  const [shortcuts, setShortcuts] = useState({
    openAddTask: null,
    openAddProject: null,
    openSearch: null,
    openFilter: null
  });

  const registerShortcut = (name, handler) => {
    setShortcuts(prev => ({ ...prev, [name]: handler }));
  };

  const unregisterShortcut = (name) => {
    setShortcuts(prev => ({ ...prev, [name]: null }));
  };

  return (
    <KeyboardShortcutContext.Provider value={{ shortcuts, registerShortcut, unregisterShortcut }}>
      {children}
    </KeyboardShortcutContext.Provider>
  );
};

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shortcuts } = useKeyboardShortcuts();
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger if not in an input field
      const isInInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || 
                            e.target.contentEditable === 'true';
      
      if (isInInputField) return;

      // Toggle keyboard shortcuts with '?' key
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShowKeyboardShortcuts(prev => !prev);
        return;
      }

      // Close shortcuts modal with Escape key
      if (e.key === 'Escape' && showKeyboardShortcuts) {
        setShowKeyboardShortcuts(false);
        return;
      }

      // Handle Alt key combinations
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        
        switch(e.key.toLowerCase()) {
          // Navigation shortcuts
          case 'h':
            navigate('/');
            toast.success('Navigated to Dashboard');
            break;
          case 't':
            navigate('/tasks');
            toast.success('Navigated to Tasks');
            break;
          case 'p':
            navigate('/projects');
            toast.success('Navigated to Projects');
            break;
          case 's':
            toast.info('Quick search coming soon!');
            break;
          case 'r':
            window.location.reload();
            break;
          case '/':
            toast.info('Help documentation coming soon!');
            break;
          case 'n':
            if (e.shiftKey) {
              // Alt + Shift + N for new project
              if (shortcuts.openAddProject) {
                shortcuts.openAddProject();
                toast.success('Opening new project dialog');
              } else {
                toast.info('Navigate to Projects page to create a new project');
              }
            } else {
              // Alt + N for new task
              if (shortcuts.openAddTask) {
                shortcuts.openAddTask();
                toast.success('Opening new task dialog');
              } else {
                toast.info('Navigate to Tasks page to create a new task');
              }
            }
            break;
          case 'e':
            if (e.shiftKey) {
              toast.info('Select a project first, then use this shortcut to edit it');
            } else {
              toast.info('Select a task first, then use this shortcut to edit it');
            }
            break;
          case 'd':
            toast.info('Select an item first, then use this shortcut to delete it');
            break;
          case 'f':
            if (shortcuts.openFilter) {
              shortcuts.openFilter();
              toast.success('Filter activated');
            } else {
              toast.info('Filtering available on Tasks and Projects pages');
            }
            break;
          case 'i':
            toast.info('Select an item first, then use this shortcut to view details');
            break;
          case 'g':
            toast.info('Select a project with a repository URL first');
            break;
          default:
            // Unhandled key combinations
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showKeyboardShortcuts, shortcuts]);

  const handleCloseShortcuts = () => {
    setShowKeyboardShortcuts(false);
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="projects" element={<Projects />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
      
      <KeyboardShortcuts 
        isOpen={showKeyboardShortcuts} 
        onClose={handleCloseShortcuts} 
      />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <KeyboardShortcutProvider>
        <AppContent />
      </KeyboardShortcutProvider>
    </BrowserRouter>
  );
}

export default App;