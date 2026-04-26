import { useState } from 'react';
import toast from 'react-hot-toast';
import { createSignal } from '../api/signal.api.js';

const INITIAL_FORM = {
  symbol: '',
  direction: 'BUY',
  entry_price: '',
  stop_loss: '',
  target_price: '',
  entry_time: '',
  expiry_time: '',
};

const SignalForm = ({ onSignalCreated }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const payload = {
        ...form,
        entry_price: Number(form.entry_price),
        stop_loss: Number(form.stop_loss),
        target_price: Number(form.target_price),
        // Convert datetime-local value to full ISO string that Zod expects
        entry_time: new Date(form.entry_time).toISOString(),
        expiry_time: new Date(form.expiry_time).toISOString(),
      };

      await createSignal(payload);
      setForm(INITIAL_FORM);
      toast.success('Signal created successfully!');
      onSignalCreated();

    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        setErrors(backendErrors);
      } else {
        toast.error('Failed to create signal. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Create Trading Signal</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Row 1 — Symbol and Direction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Trading Pair</label>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="symbol"
              value={form.symbol}
              onChange={handleChange}
              placeholder="e.g. BTCUSDT"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Direction</label>
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              name="direction"
              value={form.direction}
              onChange={handleChange}
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>

        </div>

        {/* Row 2 — Price Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Entry Price</label>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="entry_price"
              type="number"
              value={form.entry_price}
              onChange={handleChange}
              placeholder="e.g. 50000"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Stop Loss</label>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="stop_loss"
              type="number"
              value={form.stop_loss}
              onChange={handleChange}
              placeholder="e.g. 48000"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Target Price</label>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="target_price"
              type="number"
              value={form.target_price}
              onChange={handleChange}
              placeholder="e.g. 55000"
              required
            />
          </div>

        </div>

        {/* Row 3 — Time Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Entry Time</label>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="entry_time"
              type="datetime-local"
              value={form.entry_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Expiry Time</label>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="expiry_time"
              type="datetime-local"
              value={form.expiry_time}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            {errors.map((err, index) => (
              <p key={index} className="text-red-700 text-sm">• {err}</p>
            ))}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`py-3 rounded-lg text-sm font-semibold text-white transition-colors
            ${loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
        >
          {loading ? 'Creating...' : 'Create Signal'}
        </button>

      </form>
    </div>
  );
};

export default SignalForm;