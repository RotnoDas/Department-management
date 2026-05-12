import { useAuth } from "../../context/AuthContext";

export default function Pending() {
  const { user, logout } = useAuth();
  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center p-4">
      <div className="card bg-base-100 w-full max-w-md text-center shadow-xl">
        <div className="card-body p-10">
          <div className="bg-warning/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-warning h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-warning text-2xl font-bold">Pending Approval</h2>
          <p className="text-base-content/60 mt-2 text-sm">
            Hi <strong>{user?.name || "there"}</strong>! Your registration is
            awaiting admin review. You will be able to access your account once
            approved.
          </p>
          {user?.email && (
            <p className="text-base-content/40 mt-2 font-mono text-xs">
              {user.email}
            </p>
          )}
          <div className="divider my-4" />
          <p className="text-base-content/50 text-sm">
            Questions? Contact:{" "}
            <a href="mailto:admin@cse.edu" className="text-primary font-medium">
              admin@cse.edu
            </a>
          </p>
          <button
            onClick={logout}
            className="btn btn-outline btn-warning mt-4 w-full"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
