import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      // Auth state
      isAuthenticated: false,
      user: null,
      login: (username, password) => {
        if (
          username === "admin" ||
          username === "hostA" ||
          username === "hostB"
        ) {
          if (password === "password") {
            set({ isAuthenticated: true, user: username });
            return true;
          }
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      // Visitor state: maintain only hashmaps keyed by hostEmployee (in lowercase)
      visitorsByHost: {},
      preApprovalsByHost: {},

      // add visitor: update the visitorsByHost hashmap only
      addVisitor: (visitor) =>
        set((state) => {
          const host = visitor.hostEmployee.toLowerCase();
          const newVisitorsByHost = { ...state.visitorsByHost };
          newVisitorsByHost[host] = newVisitorsByHost[host]
            ? [...newVisitorsByHost[host], visitor]
            : [visitor];
          return { visitorsByHost: newVisitorsByHost };
        }),

      // add preApproval: update the preApprovalsByHost hashmap only
      addPreApproval: (preApproval) =>
        set((state) => {
          const host = preApproval.hostEmployee.toLowerCase();
          const newPreApprovalsByHost = { ...state.preApprovalsByHost };
          newPreApprovalsByHost[host] = newPreApprovalsByHost[host]
            ? [...newPreApprovalsByHost[host], preApproval]
            : [preApproval];
          return { preApprovalsByHost: newPreApprovalsByHost };
        }),

      // get all visitors for a host using the hashmaps
      getVisitorsForHost: (hostEmployee) => {
        const state = get();
        const host = hostEmployee.toLowerCase();
        const visitorsForHost = state.visitorsByHost[host] || [];
        const preApprovalsForHost = state.preApprovalsByHost[host] || [];
        // if host is admin, return all visitors and preApprovals from all hosts
        if (host === "admin") {
          const allVisitors = Object.values(state.visitorsByHost).flat();
          const allPreApprovals = Object.values(state.preApprovalsByHost).flat();
          return [...allVisitors, ...allPreApprovals];
        }
        return [...visitorsForHost, ...preApprovalsForHost];
      },

      // update visitor status by searching in the visitorsByHost hashmap
      updateVisitorStatus: (visitorId, status) =>
        set((state) => {
          const newVisitorsByHost = { ...state.visitorsByHost };
          for (const host in newVisitorsByHost) {
            newVisitorsByHost[host] = newVisitorsByHost[host].map((visitor) =>
              visitor.id === visitorId
                ? {
                    ...visitor,
                    status,
                    checkInTime:
                      status === "approved"
                        ? new Date().toISOString()
                        : visitor.checkInTime,
                  }
                : visitor
            );
          }
          return { visitorsByHost: newVisitorsByHost };
        }),

      // checkout visitor by searching in the visitorsByHost hashmap
      checkoutVisitor: (visitorId) =>
        set((state) => {
          const newVisitorsByHost = { ...state.visitorsByHost };
          for (const host in newVisitorsByHost) {
            newVisitorsByHost[host] = newVisitorsByHost[host].map((visitor) =>
              visitor.id === visitorId
                ? {
                    ...visitor,
                    status: "checked-out",
                    checkOutTime: new Date().toISOString(),
                  }
                : visitor
            );
          }
          return { visitorsByHost: newVisitorsByHost };
        }),

      // update preApproval status on check-in by searching in the preApprovalsByHost hashmap
      checkinPreApproval: (preApprovalId) =>
        set((state) => {
          const newPreApprovalsByHost = { ...state.preApprovalsByHost };
          for (const host in newPreApprovalsByHost) {
            newPreApprovalsByHost[host] = newPreApprovalsByHost[host].map((preApproval) =>
              preApproval.id === preApprovalId
                ? {
                    ...preApproval,
                    status: "checked-in",
                    checkInTime: new Date().toISOString(),
                  }
                : preApproval
            );
          }
          return { preApprovalsByHost: newPreApprovalsByHost };
        }),

      // update preApproval status on checkout by searching in the preApprovalsByHost hashmap
      checkoutPreApproval: (preApprovalId) =>
        set((state) => {
          const newPreApprovalsByHost = { ...state.preApprovalsByHost };
          for (const host in newPreApprovalsByHost) {
            newPreApprovalsByHost[host] = newPreApprovalsByHost[host].map((preApproval) =>
              preApproval.id === preApprovalId
                ? {
                    ...preApproval,
                    status: "used",
                    checkOutTime: new Date().toISOString(),
                  }
                : preApproval
            );
          }
          return { preApprovalsByHost: newPreApprovalsByHost };
        }),
    }),
    { name: "visitor-management-storage" }
  )
);

export default useStore;
