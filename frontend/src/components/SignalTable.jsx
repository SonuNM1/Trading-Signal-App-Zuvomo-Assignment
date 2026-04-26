import StatusBadge from './StatusBadge.jsx';
import { deleteSignal } from '../api/signal.api.js';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────
// HELPER: Calculate time remaining until expiry
// Returns a human readable string e.g. "2h 30m"
// ─────────────────────────────────────────────
const getTimeRemaining = (expiryTime, status) => {

  // If signal is closed — no point showing time remaining
  if (status !== 'OPEN') return '—';

  const now = new Date();
  const expiry = new Date(expiryTime);
  const diffMs = expiry - now;

  // Already expired
  if (diffMs <= 0) return 'Expired';

  // Convert milliseconds to human readable format
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// ─────────────────────────────────────────────
// HELPER: Format price to readable string
// ─────────────────────────────────────────────
const formatPrice = (price) => {
  if (!price && price !== 0) return '—';
  return `$${Number(price).toLocaleString()}`;
};

// ─────────────────────────────────────────────
// HELPER: Format ROI with color
// ─────────────────────────────────────────────
const ROIDisplay = ({ roi, status }) => {
  // No ROI to show if signal is open with no price data
  if (roi === null || roi === undefined) return <span className="text-gray-400">—</span>;

  const isPositive = roi >= 0;

  return (
    <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? '+' : ''}{roi.toFixed(2)}%
    </span>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// @param {Array} signals — list of signals from backend
// @param {function} onRefresh — called after delete to refresh list
// ─────────────────────────────────────────────
const SignalTable = ({ signals, onRefresh, loading }) => {

  const handleDelete = async (id) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this signal?')) return;

    try {
      await deleteSignal(id);
      toast.success('Signal deleted');
      // Tell parent to refresh signal list
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete signal');
    }
  };

  // Show loading state while fetching
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-400 text-sm">Loading signals...</p>
      </div>
    );
  }

  // Show empty state if no signals
  if (!signals || signals.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-400 text-sm">No signals yet. Create your first signal above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Table header */}
<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
  <h2 className="text-lg font-bold text-gray-800">Signal Dashboard</h2>
  {/* Highlighted auto-refresh badge */}
  <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
    🔄 Auto-refreshes every 15 seconds
  </span>
</div>

      {/* Scrollable table wrapper for smaller screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* Column headers */}
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Symbol</th>
              <th className="px-4 py-3 text-left">Direction</th>
              <th className="px-4 py-3 text-left">Entry Price</th>
              <th className="px-4 py-3 text-left">Target</th>
              <th className="px-4 py-3 text-left">Stop Loss</th>
              <th className="px-4 py-3 text-left">Current Price</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">ROI %</th>
              <th className="px-4 py-3 text-left">Time Left</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {signals.map((signal) => (
              <tr
                key={signal.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Symbol */}
                <td className="px-4 py-3 font-semibold text-gray-800">
                  {signal.symbol}
                </td>

                {/* Direction — colored */}
                <td className="px-4 py-3">
                  <span className={`font-semibold ${signal.direction === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                    {signal.direction}
                  </span>
                </td>

                {/* Entry Price */}
                <td className="px-4 py-3 text-gray-700">
                  {formatPrice(signal.entry_price)}
                </td>

                {/* Target Price */}
                <td className="px-4 py-3 text-green-600 font-medium">
                  {formatPrice(signal.target_price)}
                </td>

                {/* Stop Loss */}
                <td className="px-4 py-3 text-red-500 font-medium">
                  {formatPrice(signal.stop_loss)}
                </td>

                {/* Current Price — live from Binance */}
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {signal.current_price ? formatPrice(signal.current_price) : '—'}
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3">
                  <StatusBadge status={signal.status} />
                </td>

                {/* ROI */}
                <td className="px-4 py-3">
                  <ROIDisplay roi={signal.realized_roi} status={signal.status} />
                </td>

                {/* Time Remaining */}
                <td className="px-4 py-3 text-gray-500">
                  {getTimeRemaining(signal.expiry_time, signal.status)}
                </td>

                {/* Delete button */}
<td className="px-4 py-3">
  <button
    onClick={() => handleDelete(signal.id)}
    className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-600 transition-all duration-200 cursor-pointer"
  >
    Delete
  </button>
</td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default SignalTable;