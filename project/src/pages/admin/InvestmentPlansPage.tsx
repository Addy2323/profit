import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { InvestmentPlan } from '../../types/InvestmentPlan';
import { InvestmentPlanService } from '../../services/InvestmentPlanService';
import { showSuccessAlert, showErrorAlert } from '../../utils/alertUtils';

const InvestmentPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minAmount: '',
    maxAmount: '',
    dailyReturnRate: '',
    duration: '',
    features: '',
    riskLevel: 'Low' as 'Low' | 'Medium' | 'High',
    category: 'Starter' as 'Starter' | 'Professional' | 'Premium' | 'VIP',
    isActive: true
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    const allPlans = InvestmentPlanService.getAllPlans();
    setPlans(allPlans);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.minAmount || !formData.maxAmount || 
        !formData.dailyReturnRate || !formData.duration) {
      showErrorAlert('Please fill in all required fields.');
      return;
    }

    const planData = {
      name: formData.name,
      description: formData.description,
      minAmount: Number(formData.minAmount),
      maxAmount: Number(formData.maxAmount),
      dailyReturnRate: Number(formData.dailyReturnRate),
      duration: Number(formData.duration),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      riskLevel: formData.riskLevel,
      category: formData.category,
      isActive: formData.isActive
    };

    try {
      if (editingPlan) {
        InvestmentPlanService.updatePlan(editingPlan.id, planData);
        showSuccessAlert(`Investment plan "${formData.name}" updated successfully!`);
      } else {
        InvestmentPlanService.createPlan(planData);
        showSuccessAlert(`Investment plan "${formData.name}" created successfully!`);
      }
      
      loadPlans();
      closeModal();
    } catch (error) {
      showErrorAlert('Error saving investment plan. Please try again.');
    }
  };

  const handleEdit = (plan: InvestmentPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      minAmount: plan.minAmount.toString(),
      maxAmount: plan.maxAmount.toString(),
      dailyReturnRate: plan.dailyReturnRate.toString(),
      duration: plan.duration.toString(),
      features: plan.features.join(', '),
      riskLevel: plan.riskLevel,
      category: plan.category,
      isActive: plan.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (plan: InvestmentPlan) => {
    if (window.confirm(`Are you sure you want to delete "${plan.name}"?`)) {
      if (InvestmentPlanService.deletePlan(plan.id)) {
        showSuccessAlert(`Investment plan "${plan.name}" deleted successfully!`);
        loadPlans();
      } else {
        showErrorAlert('Error deleting investment plan.');
      }
    }
  };

  const togglePlanStatus = (plan: InvestmentPlan) => {
    const updated = InvestmentPlanService.updatePlan(plan.id, { isActive: !plan.isActive });
    if (updated) {
      showSuccessAlert(`Plan "${plan.name}" ${updated.isActive ? 'activated' : 'deactivated'} successfully!`);
      loadPlans();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      minAmount: '',
      maxAmount: '',
      dailyReturnRate: '',
      duration: '',
      features: '',
      riskLevel: 'Low',
      category: 'Starter',
      isActive: true
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Starter': return 'text-blue-600 bg-blue-100';
      case 'Professional': return 'text-purple-600 bg-purple-100';
      case 'Premium': return 'text-orange-600 bg-orange-100';
      case 'VIP': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Investment Plans Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
            plan.isActive ? 'border-green-500' : 'border-gray-400'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePlanStatus(plan)}
                  className={`p-1 rounded ${plan.isActive ? 'text-green-600' : 'text-gray-400'}`}
                  title={plan.isActive ? 'Deactivate' : 'Activate'}
                >
                  {plan.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => handleEdit(plan)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Min Amount:</span>
                <span className="font-medium">{plan.minAmount.toLocaleString()} TZS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Max Amount:</span>
                <span className="font-medium">{plan.maxAmount.toLocaleString()} TZS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Daily Return:</span>
                <span className="font-medium text-green-600">{plan.dailyReturnRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Duration:</span>
                <span className="font-medium">{plan.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Return:</span>
                <span className="font-medium text-green-600">{plan.totalReturnRate}%</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(plan.riskLevel)}`}>
                {plan.riskLevel} Risk
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(plan.category)}`}>
                {plan.category}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Features:</span>
              <ul className="text-sm text-gray-600">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingPlan ? 'Edit Investment Plan' : 'Create New Investment Plan'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount (TZS) *</label>
                  <input
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount (TZS) *</label>
                  <input
                    type="number"
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({...formData, maxAmount: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Return (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.dailyReturnRate}
                    onChange={(e) => setFormData({...formData, dailyReturnRate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => setFormData({...formData, riskLevel: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Premium">Premium</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  placeholder="Daily Returns, Low Risk, Flexible Withdrawal"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active Plan</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPlansPage;
