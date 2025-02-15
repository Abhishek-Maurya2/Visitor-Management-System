import { create } from "zustand";
import { persist } from "zustand/middleware";
// import type { Visitor, PreApproval } from '../types';

const useStore = create(
  persist(
    (set, get) => ({
      // Auth state
      isAuthenticated: false,
      user: null,
      login: (username, password) => {
        if (username === 'admin' || username === 'hostA' || username === 'hostB') {
          if (password === 'password') {
            set({ isAuthenticated: true, user: username });
            return true;
          }
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      // Visitor state
      visitors: [],
      preApprovals: [],
      addVisitor: (visitor) =>
        set((state) => ({ visitors: [...state.visitors, visitor] })),
      addPreApproval: (preApproval) =>
        set((state) => ({ preApprovals: [...state.preApprovals, preApproval] })),
      getVisitorsForHost: (hostEmployee) => {
        const state = get();
        const visitors = state.visitors.filter(
          (visitor) =>
            visitor.hostEmployee.toLowerCase() === hostEmployee.toLowerCase()
        );
        const preApprovals = state.preApprovals.filter(
          (preApproval) =>
            preApproval.hostEmployee.toLowerCase() === hostEmployee.toLowerCase()
        );
        if (hostEmployee === 'admin') {
          return [...state.visitors, ...state.preApprovals];
        }
        return [...visitors, ...preApprovals];
      },
      updateVisitorStatus: (visitorId, status) =>
        set((state) => ({
          visitors: state.visitors.map((visitor) =>
            visitor.id === visitorId
              ? {
                  ...visitor,
                  status,
                  checkInTime:
                    status === 'approved' ? new Date().toISOString() : visitor.checkInTime,
                }
              : visitor
          ),
        })),
      checkoutVisitor: (visitorId) =>
        set((state) => ({
          visitors: state.visitors.map((visitor) =>
            visitor.id === visitorId
              ? {
                  ...visitor,
                  status: 'checked-out',
                  checkOutTime: new Date().toISOString(),
                }
              : visitor
          ),
        })),
      checkinPreApproval: (preApprovalId) =>
        set((state) => ({
          preApprovals: state.preApprovals.map((preApproval) =>
            preApproval.id === preApprovalId
              ? {
                  ...preApproval,
                  status: 'checked-in',
                  checkInTime: new Date().toISOString(),
                }
              : preApproval
          ),
        })),
      checkoutPreApproval: (preApprovalId) =>
        set((state) => ({
          preApprovals: state.preApprovals.map((preApproval) =>
            preApproval.id === preApprovalId
              ? {
                  ...preApproval,
                  status: 'used',
                  checkOutTime: new Date().toISOString(),
                }
              : preApproval
          ),
        })),
    }),
    {
      name: 'visitor-management-storage',
    }
  )
);

export default useStore;
