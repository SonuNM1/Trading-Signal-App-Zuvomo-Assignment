const StatusBadge = ({ status }) => {

  // Map each status to tailwind classes
  const statusStyles = {
    OPEN: 'bg-blue-100 text-blue-800',
    TARGET_HIT: 'bg-green-100 text-green-800',
    STOPLOSS_HIT: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-gray-100 text-gray-600',
  };

  const statusLabels = {
    OPEN: 'Open',
    TARGET_HIT: 'Target Hit',
    STOPLOSS_HIT: 'Stop Loss Hit',
    EXPIRED: 'Expired',
  };

  // Fallback if unknown status
  const classes = statusStyles[status] || 'bg-gray-100 text-gray-600';
  const label = statusLabels[status] || status;

  return (
    <span className={`${classes} text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}>
      {label}
    </span>
  );
};

export default StatusBadge;