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
      const order = await createRazorpayOrder(Number(rechargeAmount))

      const options = {
        key: order.key, 
        amount: order.amount,
        currency: order.currency,
        name: 'KarWaan',
        description: 'Wallet Top-up',
        order_id: order.orderId,
        handler: async function (response) {
          try {
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
          color: '#f97316'
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

  return (
    <div className="app-shell">
      <header className="page-header">
        <p className="page-eyebrow">Finance</p>
        <h1>Wallet</h1>
        <p className="page-subtitle">Manage your funds, add balance, and view transaction history.</p>
      </header>

      {message.text && (
        <div className={`alert alert--${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-2">
        <div className="card card--gradient">
          <h3 style={{ margin: 0, fontWeight: 500, opacity: 0.9, color: 'white' }}>Current Balance</h3>
          <div className="wallet-balance">₹ {balance}</div>

          <form onSubmit={handleRecharge} className="wallet-recharge">
            <label>Add Funds</label>
            <div className="wallet-recharge-row">
              <input 
                type="number" 
                placeholder="Amount in ₹" 
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                min="1"
                required
              />
              <button type="submit" className="primary-btn btn-dark" disabled={recharging}>
                {recharging ? 'Adding...' : 'Recharge'}
              </button>
            </div>
          </form>
        </div>

        <div className="card card--flat">
          <h3 className="mb-md">Transaction History</h3>
          {loading ? (
            <p className="loading-text">Loading history...</p>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💳</div>
              <p>No transactions yet.</p>
            </div>
          ) : (
            <div className="tx-list">
              {transactions.map(tx => (
                <div key={tx._id} className="tx-item">
                  <div className="tx-info">
                    <div className="tx-icon">{tx.amount > 0 ? '↓' : '↑'}</div>
                    <div>
                      <span className="tx-type">{tx.type}</span>
                      <div className="tx-meta">
                        {new Date(tx.createdAt).toLocaleDateString()} · {tx.method}
                      </div>
                    </div>
                  </div>
                  <strong className={`tx-amount ${tx.amount > 0 ? 'tx-amount--credit' : ''}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
