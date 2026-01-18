const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-blue-50">
      <main className="max-w-md mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
