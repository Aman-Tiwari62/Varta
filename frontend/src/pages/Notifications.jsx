const Notifications = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold text-emerald-700 mb-4">
          Notifications
        </h1>
  
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-emerald-100"
            >
              <p className="text-gray-700">
                You have a new message
              </p>
              <span className="text-xs text-gray-400">
                2 minutes ago
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Notifications;
  