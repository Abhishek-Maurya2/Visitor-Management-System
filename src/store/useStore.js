import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      // Auth state
      isAuthenticated: false,
      user: null,
      // New hosts array
      hosts: [],
      // Updated login: check admin and lookup registered hosts
      login: (username, password) => {
        const state = get();
        // Allow admin with fixed credentials.
        if (username === "admin" && password === "password") {
          set({ isAuthenticated: true, user: username });
          toast.success("Logged in successfully");
          return true;
        }
        // For hosts, search the registered hosts array.
        const foundHost = state.hosts.find(
          (host) =>
            host.name.toLowerCase() === username.toLowerCase() &&
            host.password === password
        );
        if (foundHost) {
          set({ isAuthenticated: true, user: foundHost.name });
          toast.success("Logged in successfully");
          return true;
        }
        toast.error("Invalid username or password");
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      // Updated register: add new host to the hosts array
      register: (hostData) =>
        set((state) => ({
          hosts: [
            ...state.hosts,
            {
              id: Math.random().toString(36).substr(2, 9),
              name: hostData.name,
              email: hostData.email,
              phone: hostData.contact,
              imageUrl: hostData.image,
              department: hostData.department,
              password: hostData.password,
            },
          ],
          isAuthenticated: true,
          user: hostData.name,
        })),

      // Visitor state: maintain only hashmaps keyed by hostEmployee (in lowercase)
      visitorsByHost: {},
      preApprovalsByHost: {},

      // add visitor: update the visitorsByHost hashmap only
      addVisitor: (visitor) =>
        set((state) => {
          const host = visitor.hostEmployee.toLowerCase();
          return {
            visitorsByHost: {
              ...state.visitorsByHost,
              [host]: [...(state.visitorsByHost[host] || []), visitor],
            },
          };
        }),

      // add preApproval: update the preApprovalsByHost hashmap only
      addPreApproval: (preApproval) =>
        set((state) => {
          const host = preApproval.hostEmployee.toLowerCase();
          return {
            preApprovalsByHost: {
              ...state.preApprovalsByHost,
              [host]: [...(state.preApprovalsByHost[host] || []), preApproval],
            },
          };
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
                      status === "approved" ? new Date().toISOString() : visitor.checkInTime,
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
            newPreApprovalsByHost[host] = newPreApprovalsByHost[host].map(
              (preApproval) =>
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
            newPreApprovalsByHost[host] = newPreApprovalsByHost[host].map(
              (preApproval) =>
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
