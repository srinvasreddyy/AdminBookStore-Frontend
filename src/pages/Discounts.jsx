import React, { useEffect, useState } from 'react'
import { PlusCircle, Edit, Trash2, RefreshCw, X, Save } from 'lucide-react'
import FormInput from '../components/FormInput'
import FormSection from '../components/FormSection'
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api'

const emptyForm = {
  couponCode: '',
  description: '',
  type: 'PERCENTAGE',
  value: '',
  minCartValue: '',
  maxUses: 1,
  maxUsesPerUser: 1,
  startDate: '',
  endDate: '',
  isActive: true,
}

const Discounts = () => {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Edit modal state
  const [editing, setEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      const res = await apiGet('/discounts/my-discounts')
      setDiscounts(res.data || [])
    } catch (err) {
      console.error('Failed to fetch discounts', err)
      setError(err.message || 'Failed to fetch discounts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setFormErrors({})
    setEditing(false)
    setEditingId(null)
  }

  const validate = (values) => {
    const errs = {}
    if (!values.couponCode || values.couponCode.trim() === '') errs.couponCode = 'Coupon code is required.'
    if (!values.description || values.description.trim() === '') errs.description = 'Description is required.'
    if (!values.type) errs.type = 'Type is required.'
    if (values.type !== 'FREE_DELIVERY') {
      if (values.value === '' || isNaN(Number(values.value)) || Number(values.value) <= 0) errs.value = 'Positive value required.'
    }
    if (!values.maxUses || isNaN(Number(values.maxUses)) || Number(values.maxUses) < 1) errs.maxUses = 'Must be at least 1.'
    if (!values.maxUsesPerUser || isNaN(Number(values.maxUsesPerUser)) || Number(values.maxUsesPerUser) < 1) errs.maxUsesPerUser = 'Must be at least 1.'
    // dates optional but if provided ensure start <= end
    if (values.startDate && values.endDate) {
      const s = new Date(values.startDate)
      const e = new Date(values.endDate)
      if (s > e) errs.endDate = 'End date must be after start date.'
    }
    return errs
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const vals = { ...form }
    const errs = validate(vals)
    setFormErrors(errs)
    if (Object.keys(errs).length) return

    try {
      setSaving(true)
      if (editing && editingId) {
        const payload = { ...vals }
        // convert empty strings for numeric fields
        payload.value = payload.type === 'FREE_DELIVERY' ? 0 : Number(payload.value)
        payload.minCartValue = payload.minCartValue ? Number(payload.minCartValue) : 0
        payload.maxUses = Number(payload.maxUses)
        payload.maxUsesPerUser = Number(payload.maxUsesPerUser)
        payload.startDate = payload.startDate || undefined
        payload.endDate = payload.endDate || undefined
        await apiPatch(`/discounts/${editingId}`, payload)
      } else {
        const payload = { ...vals }
        payload.value = payload.type === 'FREE_DELIVERY' ? 0 : Number(payload.value)
        payload.minCartValue = payload.minCartValue ? Number(payload.minCartValue) : 0
        payload.maxUses = Number(payload.maxUses)
        payload.maxUsesPerUser = Number(payload.maxUsesPerUser)
        payload.startDate = payload.startDate || undefined
        payload.endDate = payload.endDate || undefined
        await apiPost('/discounts', payload)
      }
      resetForm()
      fetchDiscounts()
    } catch (err) {
      console.error('Save failed', err)
      alert(err.message || 'Failed to save discount')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (discount) => {
    setEditing(true)
    setEditingId(discount._id || discount.id)
    setForm({
      couponCode: discount.couponCode || '',
      description: discount.description || '',
      type: discount.type || 'PERCENTAGE',
      value: discount.value ?? '',
      minCartValue: discount.minCartValue ?? '',
      maxUses: discount.maxUses ?? 1,
      maxUsesPerUser: discount.maxUsesPerUser ?? 1,
      startDate: discount.startDate ? new Date(discount.startDate).toISOString().slice(0, 10) : '',
      endDate: discount.endDate ? new Date(discount.endDate).toISOString().slice(0, 10) : '',
      isActive: !!discount.isActive,
    })
  }

  const handleDelete = async (discount) => {
    const id = discount._id || discount.id
    if (!id) return
    if (!window.confirm(`Delete coupon ${discount.couponCode}? This cannot be undone.`)) return
    try {
      await apiDelete(`/discounts/${id}`)
      fetchDiscounts()
    } catch (err) {
      console.error('Delete failed', err)
      alert(err.message || 'Failed to delete discount')
    }
  }

  const handleStartCreate = () => {
    resetForm()
    setEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white sticky top-0 z-50 border-b border-gray-200 px-4 sm:px-6 md:px-8 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-800">Discounts Management</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Create and manage store discounts / coupons</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchDiscounts} disabled={loading} className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button onClick={handleStartCreate} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50">
              <PlusCircle className="w-4 h-4" />
              New Discount
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FormSection title={editing ? 'Edit Discount' : 'Create Discount'}>
              <form onSubmit={handleSubmit}>
                <FormInput label="Coupon Code" name="couponCode" value={form.couponCode} onChange={handleChange} required error={formErrors.couponCode} />
                <FormInput label="Description" name="description" value={form.description} onChange={handleChange} required error={formErrors.description} />
                <div className="grid grid-cols-2 gap-2">
                  <FormInput label="Type" name="type" type="select" value={form.type} onChange={handleChange} options={[{ value: 'PERCENTAGE', label: 'Percentage' }, { value: 'FIXED_AMOUNT', label: 'Fixed Amount' }, { value: 'FREE_DELIVERY', label: 'Free Delivery' }]} />
                  <FormInput label="Value" name="value" type="number" value={form.value} onChange={handleChange} placeholder={form.type === 'PERCENTAGE' ? 'e.g. 10 for 10%' : 'e.g. 5 for $5'} error={formErrors.value} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormInput label="Min Cart Value" name="minCartValue" type="number" value={form.minCartValue} onChange={handleChange} />
                  <FormInput label="Max Uses" name="maxUses" type="number" value={form.maxUses} onChange={handleChange} error={formErrors.maxUses} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormInput label="Max Uses / User" name="maxUsesPerUser" type="number" value={form.maxUsesPerUser} onChange={handleChange} error={formErrors.maxUsesPerUser} />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Active</label>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="isActive" checked={!!form.isActive} onChange={handleChange} className="w-4 h-4" />
                      <span className="text-sm text-gray-600">Is Active</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormInput label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
                  <FormInput label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} error={formErrors.endDate} />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-semibold transition-colors disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : editing ? 'Update Discount' : 'Create Discount'}
                  </button>
                  <button type="button" onClick={resetForm} className="px-4 py-2 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50">
                    Reset
                  </button>
                </div>
              </form>
            </FormSection>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Coupon</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Value</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Min Cart</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Uses</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Validity</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-500">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                          Loading discounts...
                        </td>
                      </tr>
                    ) : discounts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-500">No discounts found.</td>
                      </tr>
                    ) : (
                      discounts.map((d) => (
                        <tr key={d._id || d.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-semibold text-gray-800">{d.couponCode}</div>
                            <div className="text-xs text-gray-500">{d.description}</div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-700">{d.type}</td>
                          <td className="py-4 px-6 font-semibold text-gray-800">{d.type === 'PERCENTAGE' ? `${d.value}%` : d.type === 'FREE_DELIVERY' ? 'Free Delivery' : `$${d.value}`}</td>
                          <td className="py-4 px-6 text-sm text-gray-700">${d.minCartValue ?? 0}</td>
                          <td className="py-4 px-6 text-sm text-gray-700">{d.timesUsed ?? 0} / {d.maxUses}</td>
                          <td className="py-4 px-6 text-sm text-gray-700">{d.startDate ? new Date(d.startDate).toLocaleDateString() : '—'} — {d.endDate ? new Date(d.endDate).toLocaleDateString() : '—'}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEdit(d)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit Discount">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(d)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Discount">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Discounts