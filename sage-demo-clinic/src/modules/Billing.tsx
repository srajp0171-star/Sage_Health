import { useState } from 'react'
import { IndianRupee, Plus, Eye, Printer, FileText } from 'lucide-react'
import { useApp, Button, Modal, StatusBadge, StatCard, SectionTitle, EmptyState } from '../ui'
import { formatINR, formatDate, newId } from '../utils'
import { CLINIC } from '../data'

export default function BillingModule() {
  const { state, dispatch, addToast } = useApp()
  const [showCreate, setShowCreate] = useState(false)
  const [showDetail, setShowDetail] = useState<string | null>(null)
  const [invPat, setInvPat] = useState('')
  const [invItems, setInvItems] = useState([{ name: '', qty: 1, rate: 0 }])
  const [invGst, setInvGst] = useState(false)
  const [invPaid, setInvPaid] = useState('')
  const [invMethod, setInvMethod] = useState('Cash')

  const todayCollected = state.invoices.filter(i => i.date === state.todayDate).reduce((s, i) => s + i.paid, 0)
  const monthTotal = state.invoices.reduce((s, i) => s + i.paid, 0)
  const outstanding = state.invoices.reduce((s, i) => s + (i.total - i.paid), 0)
  const pending = state.invoices.filter(i => i.status !== 'Paid').length
  const getPatient = (id: string) => state.patients.find(p => p.id === id)

  const subtotal = invItems.reduce((s, it) => s + it.qty * it.rate, 0)
  const gstAmt = invGst ? Math.round(subtotal * 0.18) : 0
  const grandTotal = subtotal + gstAmt

  const addItem = () => setInvItems(items => [...items, { name: '', qty: 1, rate: 0 }])
  const updateItem = (i: number, key: string, val: string | number) => setInvItems(items => items.map((it, idx) => idx === i ? { ...it, [key]: val } : it))
  const removeItem = (i: number) => setInvItems(items => items.filter((_, idx) => idx !== i))

  const selectService = (i: number, name: string) => {
    const svc = state.services.find(s => s.name === name)
    updateItem(i, 'name', name)
    if (svc) updateItem(i, 'rate', svc.price)
  }

  const createInvoice = () => {
    if (!invPat || invItems.every(it => !it.name)) return
    const inv = {
      id: `INV-${String(state.invoices.length + 1).padStart(3, '0')}`,
      patientId: invPat, appointmentId: null, date: state.todayDate,
      items: invItems.filter(it => it.name).map(it => ({ name: it.name, qty: it.qty, rate: it.rate })),
      subtotal, gst: gstAmt, total: grandTotal,
      paid: Number(invPaid) || 0,
      status: (Number(invPaid) || 0) >= grandTotal ? 'Paid' : (Number(invPaid) || 0) > 0 ? 'Partial' : 'Unpaid',
      method: invMethod,
    }
    dispatch({ type: 'CREATE_INVOICE', payload: inv })
    addToast('success', `✓ Invoice ${inv.id} created for ${formatINR(grandTotal)}`)
    setShowCreate(false); setInvPat(''); setInvItems([{ name: '', qty: 1, rate: 0 }]); setInvPaid('')
  }

  const detailInv = state.invoices.find(i => i.id === showDetail)

  return (
    <div className="module-page fade-in">
      <div className="stats-grid">
        <StatCard icon={IndianRupee} title="Today's Collection" value={formatINR(todayCollected)} color="#6DBF8A" />
        <StatCard icon={IndianRupee} title="Total Collected" value={formatINR(monthTotal)} color="#4A9EFF" />
        <StatCard icon={IndianRupee} title="Outstanding" value={formatINR(outstanding)} color="#F45B5B" />
        <StatCard icon={FileText} title="Pending Invoices" value={pending} color="#F0B429" />
      </div>

      <SectionTitle title="All Invoices" action={<Button onClick={() => setShowCreate(true)}><Plus size={14} /> Create Invoice</Button>} />
      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Invoice #</th><th>Date</th><th>Patient</th><th>Items</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {state.invoices.map(inv => (
                <tr key={inv.id}>
                  <td className="mono">{inv.id}</td>
                  <td>{formatDate(inv.date)}</td>
                  <td>{getPatient(inv.patientId)?.name || '–'}</td>
                  <td>{inv.items.map(it => it.name).join(', ')}</td>
                  <td className="mono">{formatINR(inv.total)}</td>
                  <td className="mono">{formatINR(inv.paid)}</td>
                  <td className="mono" style={{ color: inv.total - inv.paid > 0 ? '#F45B5B' : '#6DBF8A' }}>{formatINR(inv.total - inv.paid)}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td><button className="text-btn" onClick={() => setShowDetail(inv.id)}><Eye size={14} /> View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Invoice" size="lg">
        <div className="form-stack">
          <div className="form-group"><label className="form-label">Patient</label>
            <select className="form-input" value={invPat} onChange={e => setInvPat(e.target.value)}>
              <option value="">Select patient...</option>
              {state.patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <label className="form-label">Line Items</label>
          {invItems.map((it, i) => (
            <div key={i} className="med-row">
              <select className="form-input" value={it.name} onChange={e => selectService(i, e.target.value)}>
                <option value="">Select service...</option>
                {state.services.map(s => <option key={s.id} value={s.name}>{s.name} – ₹{s.price}</option>)}
              </select>
              <input className="form-input form-input--sm" type="number" value={it.qty} onChange={e => updateItem(i, 'qty', Number(e.target.value))} style={{ width: 70 }} />
              <input className="form-input form-input--sm" type="number" value={it.rate} onChange={e => updateItem(i, 'rate', Number(e.target.value))} style={{ width: 100 }} />
              <span className="mono" style={{ minWidth: 80 }}>{formatINR(it.qty * it.rate)}</span>
              {invItems.length > 1 && <button className="text-btn text-btn--red" onClick={() => removeItem(i)}>✕</button>}
            </div>
          ))}
          <button className="text-btn" onClick={addItem}><Plus size={14} /> Add Item</button>
          <div className="invoice-totals">
            <div className="summary-row"><span>Subtotal</span><strong className="mono">{formatINR(subtotal)}</strong></div>
            <div className="summary-row">
              <label><input type="checkbox" checked={invGst} onChange={e => setInvGst(e.target.checked)} style={{ marginRight: 6 }} /> GST 18%</label>
              <strong className="mono">{formatINR(gstAmt)}</strong>
            </div>
            <div className="summary-row" style={{ fontSize: 18, color: '#6DBF8A' }}><span>Grand Total</span><strong className="mono">{formatINR(grandTotal)}</strong></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Payment Received (₹)</label><input className="form-input" type="number" value={invPaid} onChange={e => setInvPaid(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Method</label>
              <select className="form-input" value={invMethod} onChange={e => setInvMethod(e.target.value)}><option>Cash</option><option>Card</option><option>UPI</option></select>
            </div>
          </div>
          <Button onClick={createInvoice} className="w-full">Generate Invoice</Button>
        </div>
      </Modal>

      {/* Detail Drawer */}
      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="Invoice Detail" size="md">
        {detailInv && (
          <div className="invoice-detail">
            <div className="invoice-letterhead">
              <h3>{state.clinicName}</h3>
              <p className="text-muted">{CLINIC.address}</p>
              <p className="text-muted">GSTIN: {CLINIC.gstin}</p>
            </div>
            <div className="summary-row"><span>Patient:</span><strong>{getPatient(detailInv.patientId)?.name}</strong></div>
            <div className="summary-row"><span>Invoice:</span><strong className="mono">{detailInv.id}</strong></div>
            <div className="summary-row"><span>Date:</span><strong>{formatDate(detailInv.date)}</strong></div>
            <table className="data-table data-table--compact" style={{ margin: '12px 0' }}>
              <thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
              <tbody>
                {detailInv.items.map((it, i) => (
                  <tr key={i}><td>{it.name}</td><td>{it.qty}</td><td className="mono">{formatINR(it.rate)}</td><td className="mono">{formatINR(it.qty * it.rate)}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="summary-row"><span>Total:</span><strong className="mono">{formatINR(detailInv.total)}</strong></div>
            <div className="summary-row"><span>Paid:</span><strong className="mono" style={{ color: '#6DBF8A' }}>{formatINR(detailInv.paid)}</strong></div>
            <div className="summary-row"><span>Balance:</span><strong className="mono" style={{ color: detailInv.total - detailInv.paid > 0 ? '#F45B5B' : '#6DBF8A' }}>{formatINR(detailInv.total - detailInv.paid)}</strong></div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button size="sm" onClick={() => addToast('info', '📄 PDF downloading...')}><Printer size={14} /> Print</Button>
              <Button size="sm" variant="secondary" onClick={() => addToast('success', '✓ Sent via WhatsApp')}>WhatsApp</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
