import { useState } from 'react'
import { Search, AlertTriangle, Plus, Package } from 'lucide-react'
import { useApp, Button, Modal, StatusBadge, SectionTitle, EmptyState } from '../ui'
import { formatINR } from '../utils'
import { DEMO_TODAY } from '../data'

export default function PharmacyModule() {
  const { state, dispatch, addToast } = useApp()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showOrder, setShowOrder] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [orderQty, setOrderQty] = useState('50')

  // Add medicine form
  const [nm, setNm] = useState({ name: '', category: '', stock: '', unit: 'Tablet', mrp: '', expiry: '', supplier: '', threshold: '20' })

  const lowStockItems = state.pharmacy.filter(m => m.stock < m.threshold)
  const categories = [...new Set(state.pharmacy.map(m => m.category))]

  const getStatus = (m: typeof state.pharmacy[0]) => {
    if (m.stock < m.threshold * 0.25) return 'Critical'
    if (m.stock < m.threshold) return 'Low Stock'
    const expDate = new Date(m.expiry + '-01')
    const now = new Date(DEMO_TODAY)
    const diff = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
    if (diff < 3) return 'Expiring Soon'
    return 'In Stock'
  }

  const filtered = state.pharmacy.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false
    if (catFilter && m.category !== catFilter) return false
    if (statusFilter) {
      const s = getStatus(m)
      if (statusFilter === 'Low Stock' && s !== 'Low Stock' && s !== 'Critical') return false
      if (statusFilter === 'Expiring' && s !== 'Expiring Soon') return false
    }
    return true
  })

  const handleOrder = () => {
    if (!showOrder || !orderQty) return
    dispatch({ type: 'UPDATE_STOCK', id: showOrder, qty: Number(orderQty) })
    const med = state.pharmacy.find(m => m.id === showOrder)
    addToast('success', `✓ Stock updated: ${med?.name} — ${orderQty} units added`)
    setShowOrder(null); setOrderQty('50')
  }

  const handleAdd = () => {
    if (!nm.name) return
    const item = {
      id: `MED${String(state.pharmacy.length + 1).padStart(3, '0')}`,
      name: nm.name, category: nm.category, stock: Number(nm.stock) || 0,
      unit: nm.unit, mrp: Number(nm.mrp) || 0, expiry: nm.expiry,
      supplier: nm.supplier, threshold: Number(nm.threshold) || 20,
    }
    dispatch({ type: 'ADD_PHARMACY_ITEM', payload: item })
    addToast('success', `✓ ${nm.name} added to pharmacy`)
    setShowAdd(false)
    setNm({ name: '', category: '', stock: '', unit: 'Tablet', mrp: '', expiry: '', supplier: '', threshold: '20' })
  }

  return (
    <div className="module-page fade-in">
      {lowStockItems.length > 0 && (
        <div className="alert-banner alert-banner--amber">
          <AlertTriangle size={18} />
          <span>⚠ {lowStockItems.length} items need attention — {lowStockItems.map(m => `${m.name} (${m.stock} units)`).join(', ')}</span>
        </div>
      )}

      <SectionTitle title="Pharmacy & Inventory" subtitle={`${state.pharmacy.length} medicines tracked`}
        action={<Button onClick={() => setShowAdd(true)}><Plus size={14} /> Add Medicine</Button>} />

      <div className="filter-row" style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: '#8896B0' }} />
          <input className="form-input" style={{ paddingLeft: 32 }} placeholder="Search medicines..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input form-input--sm" value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ width: 160 }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="form-input form-input--sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 140 }}>
          <option value="">All Status</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Expiring">Expiring Soon</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Medicine</th><th>Category</th><th>Stock</th><th>Unit</th><th>MRP</th><th>Expiry</th><th>Supplier</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(m => {
                const status = getStatus(m)
                return (
                  <tr key={m.id}>
                    <td><strong>{m.name}</strong></td>
                    <td>{m.category}</td>
                    <td className="mono">{m.stock}</td>
                    <td>{m.unit}</td>
                    <td className="mono">₹{m.mrp.toFixed(2)}</td>
                    <td className="mono">{m.expiry}</td>
                    <td>{m.supplier}</td>
                    <td><StatusBadge status={status} /></td>
                    <td><button className="text-btn" onClick={() => { setShowOrder(m.id); setOrderQty('50') }}>Order More</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order More Modal */}
      <Modal isOpen={!!showOrder} onClose={() => setShowOrder(null)} title="Order Stock" size="sm">
        <div className="form-stack">
          <p><strong>{state.pharmacy.find(m => m.id === showOrder)?.name}</strong></p>
          <div className="form-group"><label className="form-label">Quantity to Order</label><input className="form-input" type="number" value={orderQty} onChange={e => setOrderQty(e.target.value)} /></div>
          <Button onClick={handleOrder} className="w-full">Update Stock</Button>
        </div>
      </Modal>

      {/* Add Medicine Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Medicine" size="md">
        <div className="form-stack">
          <div className="form-row">
            <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={nm.name} onChange={e => setNm(n => ({ ...n, name: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={nm.category} onChange={e => setNm(n => ({ ...n, category: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Initial Stock</label><input className="form-input" type="number" value={nm.stock} onChange={e => setNm(n => ({ ...n, stock: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Unit</label><input className="form-input" value={nm.unit} onChange={e => setNm(n => ({ ...n, unit: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">MRP (₹)</label><input className="form-input" type="number" value={nm.mrp} onChange={e => setNm(n => ({ ...n, mrp: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Expiry (YYYY-MM)</label><input className="form-input" value={nm.expiry} onChange={e => setNm(n => ({ ...n, expiry: e.target.value }))} placeholder="2026-12" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Supplier</label><input className="form-input" value={nm.supplier} onChange={e => setNm(n => ({ ...n, supplier: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Threshold</label><input className="form-input" type="number" value={nm.threshold} onChange={e => setNm(n => ({ ...n, threshold: e.target.value }))} /></div>
          </div>
          <Button onClick={handleAdd} className="w-full">Add Medicine</Button>
        </div>
      </Modal>
    </div>
  )
}
