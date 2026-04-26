import { useState, useEffect, useCallback } from 'react';
import { getAllSignals } from '../api/signal.api.js';
import SignalForm from '../components/SignalForm.jsx';
import SignalTable from '../components/SignalTable.jsx';
import toast from 'react-hot-toast';

const Dashboard = () => {
  // Holds all signals fetched from backend
  const [signals, setSignals] = useState([]);

  // Loading state for initial fetch
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────────
  // Fetch all signals from backend
  // useCallback memoizes this function so it can
  // safely be used in useEffect and passed as prop
  // ─────────────────────────────────────────────
  const fetchSignals = useCallback(async () => {
    try {
      const data = await getAllSignals();
      setSignals(data);
    } catch (error) {
      toast.error('Failed to fetch signals');
    } finally {
      // Turn off loading after first fetch
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch immediately on mount
    fetchSignals();

    // Then auto refresh every 15 seconds as assignment requires
    const interval = setInterval(() => {
      fetchSignals();
    }, 15000);

    // Cleanup interval when component unmounts — prevents memory leaks
    return () => clearInterval(interval);
  }, [fetchSignals]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Trading Signal Tracker</h1>
        <p className="text-sm text-gray-500 mt-1">Live crypto signal tracking powered by Binance</p>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6">

        {/* Signal creation form */}
        <SignalForm onSignalCreated={fetchSignals} />

        {/* Signal dashboard table */}
        <SignalTable
          signals={signals}
          onRefresh={fetchSignals}
          loading={loading}
        />

      </div>
    </div>
  );
};

export default Dashboard;