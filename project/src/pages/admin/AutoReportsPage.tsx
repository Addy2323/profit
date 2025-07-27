import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Clock, CheckCircle, Settings, Play, Pause } from 'lucide-react';
import { showSuccessAlert, showErrorAlert, showInfoAlert } from '../../utils/alertUtils';

interface ReportConfig {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'excel' | 'csv';
  enabled: boolean;
  lastGenerated?: string;
  nextScheduled?: string;
  recipients: string[];
  includeCharts: boolean;
  sections: string[];
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  format: string;
  generatedAt: string;
  fileSize: string;
  downloadUrl: string;
}

const AutoReportsPage: React.FC = () => {
  const [reportConfigs, setReportConfigs] = useState<ReportConfig[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ReportConfig | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    loadReportConfigs();
    loadGeneratedReports();
  }, []);

  const loadReportConfigs = () => {
    const configs = JSON.parse(localStorage.getItem('report_configs') || '[]');
    if (configs.length === 0) {
      // Initialize with default configurations
      const defaultConfigs: ReportConfig[] = [
        {
          id: 'daily_summary',
          name: 'Daily Summary Report',
          type: 'daily',
          format: 'pdf',
          enabled: true,
          recipients: ['admin@profitnet.com'],
          includeCharts: true,
          sections: ['revenue', 'users', 'transactions', 'withdrawals'],
          nextScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'weekly_analytics',
          name: 'Weekly Analytics Report',
          type: 'weekly',
          format: 'excel',
          enabled: true,
          recipients: ['admin@profitnet.com', 'manager@profitnet.com'],
          includeCharts: true,
          sections: ['revenue', 'users', 'transactions', 'fraud_alerts', 'investment_plans'],
          nextScheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'monthly_executive',
          name: 'Monthly Executive Summary',
          type: 'monthly',
          format: 'pdf',
          enabled: false,
          recipients: ['ceo@profitnet.com', 'admin@profitnet.com'],
          includeCharts: true,
          sections: ['revenue', 'users', 'growth_metrics', 'investment_performance'],
          nextScheduled: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem('report_configs', JSON.stringify(defaultConfigs));
      setReportConfigs(defaultConfigs);
    } else {
      setReportConfigs(configs);
    }
  };

  const loadGeneratedReports = () => {
    const reports = JSON.parse(localStorage.getItem('generated_reports') || '[]');
    if (reports.length === 0) {
      // Initialize with sample generated reports
      const sampleReports: GeneratedReport[] = [
        {
          id: 'report_001',
          name: 'Daily Summary Report',
          type: 'daily',
          format: 'pdf',
          generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          fileSize: '2.4 MB',
          downloadUrl: '#'
        },
        {
          id: 'report_002',
          name: 'Weekly Analytics Report',
          type: 'weekly',
          format: 'excel',
          generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          fileSize: '5.1 MB',
          downloadUrl: '#'
        },
        {
          id: 'report_003',
          name: 'Daily Summary Report',
          type: 'daily',
          format: 'pdf',
          generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          fileSize: '2.2 MB',
          downloadUrl: '#'
        }
      ];
      localStorage.setItem('generated_reports', JSON.stringify(sampleReports));
      setGeneratedReports(sampleReports);
    } else {
      setGeneratedReports(reports);
    }
  };

  const handleGenerateReport = async (configId: string) => {
    setGenerating(configId);
    
    // Simulate report generation
    setTimeout(() => {
      const config = reportConfigs.find(c => c.id === configId);
      if (config) {
        const newReport: GeneratedReport = {
          id: `report_${Date.now()}`,
          name: config.name,
          type: config.type,
          format: config.format,
          generatedAt: new Date().toISOString(),
          fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
          downloadUrl: '#'
        };

        const updatedReports = [newReport, ...generatedReports];
        setGeneratedReports(updatedReports);
        localStorage.setItem('generated_reports', JSON.stringify(updatedReports));

        // Update last generated time for config
        const updatedConfigs = reportConfigs.map(c => 
          c.id === configId 
            ? { ...c, lastGenerated: new Date().toISOString() }
            : c
        );
        setReportConfigs(updatedConfigs);
        localStorage.setItem('report_configs', JSON.stringify(updatedConfigs));

        showSuccessAlert(`${config.name} generated successfully!`);
      }
      setGenerating(null);
    }, 3000);
  };

  const handleToggleConfig = (configId: string) => {
    const updatedConfigs = reportConfigs.map(config =>
      config.id === configId ? { ...config, enabled: !config.enabled } : config
    );
    setReportConfigs(updatedConfigs);
    localStorage.setItem('report_configs', JSON.stringify(updatedConfigs));
    
    const config = updatedConfigs.find(c => c.id === configId);
    if (config) {
      showInfoAlert(`${config.name} ${config.enabled ? 'enabled' : 'disabled'}.`);
    }
  };

  const handleDownloadReport = (report: GeneratedReport) => {
    // In a real app, this would download the actual file
    showInfoAlert(`Downloading ${report.name} (${report.format.toUpperCase()})...`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'text-blue-600 bg-blue-100';
      case 'weekly': return 'text-green-600 bg-green-100';
      case 'monthly': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'csv': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Auto Reports Management</h1>
        <button
          onClick={() => {
            setEditingConfig(null);
            setShowConfigModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Settings size={16} />
          New Report Config
        </button>
      </div>

      {/* Report Configurations */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Report Configurations</h2>
          <p className="text-sm text-gray-600 mt-1">Manage automated report generation settings</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {reportConfigs.map((config) => (
              <div key={config.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getFormatIcon(config.format)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{config.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(config.type)}`}>
                            {config.type.charAt(0).toUpperCase() + config.type.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {config.format.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      {config.lastGenerated && (
                        <div className="text-gray-600">
                          Last: {formatDate(config.lastGenerated)}
                        </div>
                      )}
                      {config.nextScheduled && config.enabled && (
                        <div className="text-gray-600">
                          Next: {formatDate(config.nextScheduled)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleConfig(config.id)}
                        className={`p-2 rounded-lg ${
                          config.enabled 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={config.enabled ? 'Disable' : 'Enable'}
                      >
                        {config.enabled ? <Play size={16} /> : <Pause size={16} />}
                      </button>
                      
                      <button
                        onClick={() => handleGenerateReport(config.id)}
                        disabled={generating === config.id}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
                      >
                        {generating === config.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            Generate Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>Recipients: {config.recipients.length}</span>
                    <span>Sections: {config.sections.length}</span>
                    <span>Charts: {config.includeCharts ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Reports */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Generated Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Download previously generated reports</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {generatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getFormatIcon(report.format)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-sm text-gray-500">ID: {report.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.format.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.generatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.fileSize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDownloadReport(report)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {generatedReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reports generated yet. Generate your first report using the configurations above.
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Configs</p>
              <p className="text-2xl font-bold text-gray-900">{reportConfigs.length}</p>
            </div>
            <Settings className="text-gray-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Configs</p>
              <p className="text-2xl font-bold text-green-600">
                {reportConfigs.filter(c => c.enabled).length}
              </p>
            </div>
            <CheckCircle className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Generated Reports</p>
              <p className="text-2xl font-bold text-blue-600">{generatedReports.length}</p>
            </div>
            <FileText className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Scheduled</p>
              <p className="text-sm font-bold text-purple-600">
                {reportConfigs.filter(c => c.enabled && c.nextScheduled).length} pending
              </p>
            </div>
            <Clock className="text-purple-400" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoReportsPage;
