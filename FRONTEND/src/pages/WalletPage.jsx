import { useState, useEffect } from 'react'
import { getProfile, getWalletTransactions, createRazorpayOrder, verifyRazorpayPayment } from '../lib/api.js'

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [recharging, setRecharging] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const loadData = async () => {
    try {
      const [profileData, txData] = await Promise.all([
        getProfile(),
        getWalletTransactions()
      ])
      setBalance(profileData.user.walletBalance || 0)
      setTransactions(txData)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load wallet data: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRecharge = async (e) => {
    e.preventDefault()
    if (!rechargeAmount || Number(rechargeAmount) <= 0) return

    setRecharging(true)
    setMessage({ type: '', text: '' })
    
    try {
      // 1. Create order on backend
      const order = await createRazorpayOrder(Number(rechargeAmount))

      // 2. Open Razorpay checkout
      const options = {
        key: order.key, 
        amount: order.amount,
        currency: order.currency,
        name: 'KarWaan',
        description: 'Wallet Top-up',
        order_id: order.orderId,
        handler: async function (response) {
          try {
            // 3. Verify payment on backend
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: Number(rechargeAmount)
            })
            
            setMessage({ type: 'success', text: `Successfully added ₹${rechargeAmount} to your wallet via Razorpay!` })
            setRechargeAmount('')
            await loadData()
          } catch (err) {
            setMessage({ type: 'error', text: 'Payment verification failed: ' + err.message })
          }
        },
        theme: {
          color: '#38bdf8' // matches our blue accent
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        setMessage({ type: 'error', text: 'Payment failed: ' + response.error.description })
      })
      rzp.open()
      
    } catch (err) {
      setMessage({ type: 'error', text: 'Checkout failed: ' + err.message })
    } finally {
      setRecharging(false)
    }
  }

  const getTxColor = (amount) => {
    if (amount > 0) return 'var(--success)'
    if (amount < 0) return 'var(--danger)'
    return 'inherit'
  }

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="topbar">
          <div className="brand"><span>💳</span><span>My Wallet</span></div>
          <span className="badge">Balance: ₹{balance}</span>
        </div>

        {message.text && (
          <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: 8, background: message.type === 'error' ? 'var(--danger-bg)' : 'var(--success-bg)', color: message.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
            {message.text}
          </div>
        )}

        <div className="grid grid-2">
          <div className="panel">
            <h3>Current Balance</h3>
            <div style={{ fontSize: '3rem', fontWeight: 700, margin: '1rem 0', color: 'var(--success)' }}>
              ₹ {balance}
            </div>

            <form onSubmit={handleRecharge} style={{ marginTop: '2rem' }}>
              <label>Add Funds (Mock)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="number" 
                  placeholder="Amount in ₹" 
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  min="1"
                  required
                  style={{ flex: 1 }}
                />
                <button type="submit" className="primary-btn" disabled={recharging}>
                  {recharging ? 'Adding...' : 'Recharge'}
                </button>
              </div>
            </form>
          </div>

          <div className="panel">
            <h3>Transaction History</h3>
            {loading ? (
              <p className="muted">Loading history...</p>
            ) : transactions.length === 0 ? (
              <p className="muted">No transactions yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {transactions.map(tx => (
                  <div key={tx._id} className="card space-between" style={{ padding: '0.8rem 1rem' }}>
                    <div>
                      <strong>{tx.type}</strong>
                      <div className="muted" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        {new Date(tx.createdAt).toLocaleDateString()} • {tx.method}
                      </div>
                    </div>
                    <strong style={{ color: getTxColor(tx.amount), fontSize: '1.1rem' }}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
