import React, { useState } from 'react';
import { formatINR } from '../../utils/formatters';
import type { YearBreakdown, AmortizationRow } from '../../types/calculator';
import { Table, ChevronDown, ChevronUp } from 'lucide-react';

interface ScheduleTableProps {
  title?: string;
  yearlyBreakdown?: YearBreakdown[];
  amortizationSchedule?: AmortizationRow[];
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  title = 'Annual Growth Breakdown',
  yearlyBreakdown,
  amortizationSchedule,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasData = (yearlyBreakdown && yearlyBreakdown.length > 0) || (amortizationSchedule && amortizationSchedule.length > 0);
  if (!hasData) return null;

  return (
    <div className="bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mt-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Table size={18} className="text-[#00D09C]" />
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-[#00D09C] hover:text-[#00B386] flex items-center gap-1 focus:outline-none"
        >
          {isExpanded ? (
            <>
              Hide Breakdown <ChevronUp size={16} />
            </>
          ) : (
            <>
              View Full Schedule <ChevronDown size={16} />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase tracking-wider">
                <th className="py-2.5 px-3">Year</th>
                {amortizationSchedule ? (
                  <>
                    <th className="py-2.5 px-3">Opening Balance</th>
                    <th className="py-2.5 px-3">EMI Paid</th>
                    <th className="py-2.5 px-3">Principal Paid</th>
                    <th className="py-2.5 px-3">Interest Paid</th>
                    <th className="py-2.5 px-3">Closing Balance</th>
                  </>
                ) : (
                  <>
                    <th className="py-2.5 px-3">Total Invested</th>
                    <th className="py-2.5 px-3">Returns Earned</th>
                    <th className="py-2.5 px-3 text-right">Total Balance</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
              {amortizationSchedule
                ? amortizationSchedule.map((row) => (
                    <tr
                      key={row.year}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 text-gray-800 dark:text-gray-200 transition-colors"
                    >
                      <td className="py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                        Year {row.year}
                      </td>
                      <td className="py-2 px-3">{formatINR(row.openingBalance)}</td>
                      <td className="py-2 px-3 text-[#00D09C] font-semibold">{formatINR(row.emiPaid)}</td>
                      <td className="py-2 px-3">{formatINR(row.principalPaid)}</td>
                      <td className="py-2 px-3 text-rose-500">{formatINR(row.interestPaid)}</td>
                      <td className="py-2 px-3 font-semibold">{formatINR(row.closingBalance)}</td>
                    </tr>
                  ))
                : yearlyBreakdown?.map((row) => (
                    <tr
                      key={row.year}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 text-gray-800 dark:text-gray-200 transition-colors"
                    >
                      <td className="py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                        Year {row.year}
                      </td>
                      <td className="py-2 px-3">{formatINR(row.investedOrPrincipal)}</td>
                      <td className="py-2 px-3 text-[#00D09C] font-semibold">{formatINR(row.interestOrReturns)}</td>
                      <td className="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">
                        {formatINR(row.totalBalance)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
