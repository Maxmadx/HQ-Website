/**
 * EditModeContext — provides edit mode state to the whole app.
 *
 * Only admins (Firebase custom claim role=admin|super_admin) can activate
 * edit mode. For everyone else the context is always a no-op.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { useAdmin } from '../hooks/useAdmin';

const EditModeContext = createContext({
  isAdmin:          false,
  isEditMode:       false,
  activeSection:    null,
  toggleEditMode:   () => {},
  activateEditMode: () => {},
  deactivateEditMode: () => {},
  openSection:      () => {},
  closeSection:     () => {},
});

export function EditModeProvider({ children }) {
  const { isAdmin } = useAdmin();
  const [isEditMode,    setIsEditMode]    = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const toggleEditMode = useCallback(() => {
    if (!isAdmin) return;
    setIsEditMode(prev => {
      if (prev) setActiveSection(null);
      return !prev;
    });
  }, [isAdmin]);

  const activateEditMode = useCallback(() => {
    if (isAdmin) setIsEditMode(true);
  }, [isAdmin]);

  const deactivateEditMode = useCallback(() => {
    setIsEditMode(false);
    setActiveSection(null);
  }, []);

  const openSection = useCallback((sectionId) => {
    if (!isAdmin) return;
    setActiveSection(sectionId);
    if (!isEditMode) setIsEditMode(true);
  }, [isAdmin, isEditMode]);

  const closeSection = useCallback(() => setActiveSection(null), []);

  return (
    <EditModeContext.Provider value={{
      isAdmin,
      isEditMode: isAdmin && isEditMode,
      activeSection,
      toggleEditMode,
      activateEditMode,
      deactivateEditMode,
      openSection,
      closeSection,
    }}>
      {children}
    </EditModeContext.Provider>
  );
}

export const useEditMode = () => useContext(EditModeContext);
