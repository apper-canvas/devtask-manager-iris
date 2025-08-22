import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import KeyboardShortcuts from "@/components/molecules/KeyboardShortcuts";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import Dashboard from "@/components/pages/Dashboard";
import Layout from "@/components/organisms/Layout";

function App() {
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
            window.location.href = '/';
            toast.success('Navigated to Dashboard');
            break;
          case 't':
            window.location.href = '/tasks';
            toast.success('Navigated to Tasks');
            break;
          case 'p':
            window.location.href = '/projects';
            toast.success('Navigated to Projects');
            break;
          case 's':
            toast.info('Quick search coming soon!');
            break;
          case 'r':
            window.location.reload();
            toast.success('Refreshing application...');
            break;
          case '/':
            toast.info('Help documentation coming soon!');
            break;
          case 'n':
            if (e.shiftKey) {
              // Alt + Shift + N for new project
              toast.info('New project shortcut - navigate to Projects page to create');
            } else {
              // Alt + N for new task
              toast.info('New task shortcut - navigate to Tasks page to create');
            }
            break;
          case 'e':
            if (e.shiftKey) {
              // Alt + Shift + E for edit project
              toast.info('Edit project shortcut - select a project first');
            } else {
              // Alt + E for edit task
              toast.info('Edit task shortcut - select a task first');
            }
            break;
          case 'd':
            toast.info('Delete shortcut - select an item first');
            break;
          case 'f':
            toast.info('Filter shortcut available on Tasks page');
            break;
          case 'i':
            toast.info('View details shortcut - select a project first');
            break;
          case 'g':
            toast.info('Open repository shortcut - select a project first');
            break;
          default:
            // Don't show toast for unhandled combinations
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showKeyboardShortcuts]);
  const handleCloseShortcuts = () => {
    setShowKeyboardShortcuts(false);
  };

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;