import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center p-6">
      <div className="max-w-md p-8 bg-base-100 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-error">🚫 Access Denied</h1>
        <p className="mt-3 text-lg text-gray-600">
          You do not have permission to view this page.
        </p>

        <div className="mt-6 flex flex-col space-y-3">
          <Link to="/" className="btn btn-primary">
            🔙 Return to Home
          </Link>
          {/* <Link to="/login" className="btn btn-outline">
            🔑 Login Again
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
