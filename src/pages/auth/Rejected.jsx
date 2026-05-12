import { useAuth } from "../../context/AuthContext";

export default function Rejected() {
  const { logout } = useAuth();
  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center p-4">
      <div className="card bg-base-100 w-full max-w-md text-center shadow-xl">
        <div className="card-body p-10">
          <div className="bg-error/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-error h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-error text-2xl font-bold">
            Application Rejected
          </h2>
          <p className="text-base-content/60 mt-2 text-sm">
            Unfortunately, your account application has been rejected by the
            administrator.
          </p>
          <div className="divider my-4" />
          <p className="text-base-content/50 text-sm">
            For more information, contact:
            <br />
            <a href="mailto:admin@cse.edu" className="text-primary font-medium">
              admin@cse.edu
            </a>
          </p>
          <button
            onClick={logout}
            className="btn btn-outline btn-error mt-4 w-full"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
