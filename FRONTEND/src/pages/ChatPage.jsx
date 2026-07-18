import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { getAuthToken } from '../lib/api.js'
import { getStoredSession } from '../lib/auth.js'
import { getChatHistory, getMyTrips } from '../lib/api.js'

export default function ChatPage() {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const { user } = getStoredSession() || {}
  
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [socket, setSocket] = useState(null)
  const [rideInfo, setRideInfo] = useState(null)
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    let alive = true

    // Load Chat History & Ride details
    Promise.all([
      getChatHistory(rideId),
      getMyTrips()
    ]).then(([history, trips]) => {
      if (!alive) return
      setMessages(history)
      
      const ride = trips.find(t => t._id === rideId)
      if (ride) setRideInfo(ride)
    }).catch(console.error)

    // Setup Socket
    const token = getAuthToken()
    const newSocket = io('http://localhost:5000', {
      auth: { token }
    })

    newSocket.on('connect', () => {
      newSocket.emit('join_ride_room', { rideId })
    })

    newSocket.on('chat_message_received', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    setSocket(newSocket)

    return () => {
      alive = false
      newSocket.disconnect()
    }
  }, [rideId])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim() || !socket) return

    socket.emit('send_chat_message', { rideId, text: inputText })
    setInputText('')
  }
  
  // Calculate Call details
  let callName = 'Driver'
  let callPhone = ''
  
  if (rideInfo) {
    const isDriver = rideInfo.driverId?._id === user?._id || rideInfo.driverId === user?._id
    if (isDriver) {
      // Driver calling passenger (if multiple, we just call the first for simplicity in this demo)
      callName = 'Passenger'
      callPhone = rideInfo.passengers?.[0]?.userId?.phone || ''
    } else {
      // Passenger calling driver
      callName = rideInfo.driverId?.name || 'Driver'
      callPhone = rideInfo.driverId?.phone || ''
    }
  }

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 58px)', overflow: 'hidden', padding: 0 }}>
      <div className="topbar" style={{ padding: '0.8rem 1.2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button className="secondary-btn" onClick={() => navigate(-1)} style={{ padding: '0.4rem 0.8rem' }}>← Back</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
          {rideInfo ? `${rideInfo.pickupLocation?.address.split(',')[0]} → ${rideInfo.destinationLocation?.address.split(',')[0]}` : 'Loading...'}
        </div>
        {callPhone ? (
          <a href={`tel:${callPhone}`} className="primary-btn" style={{ padding: '0.4rem 0.8rem', textDecoration: 'none', background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            📞 Call {callName.split(' ')[0]}
          </a>
        ) : (
          <button className="secondary-btn" disabled style={{ padding: '0.4rem 0.8rem' }}>📞 Call</button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
            No messages yet. Say hello! 👋
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.senderId === user?._id
          return (
            <div key={msg._id} style={{
              alignSelf: isMe ? 'flex-end' : 'flex-start',
              background: isMe ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : 'var(--bg-glass-hover)',
              color: isMe ? 'white' : 'var(--text-primary)',
              padding: '0.6rem 1rem',
              borderRadius: '16px',
              maxWidth: '75%',
              wordBreak: 'break-word',
              border: isMe ? 'none' : '1px solid var(--border)'
            }}>
              {!isMe && <div style={{ fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.2rem', color: 'var(--accent)' }}>{msg.senderName}</div>}
              <div>{msg.text}</div>
              <div style={{ fontSize: '0.68rem', opacity: 0.7, textAlign: 'right', marginTop: '0.2rem' }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ padding: '0.8rem 1rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <button type="submit" className="primary-btn" disabled={!inputText.trim()}>Send</button>
      </form>
    </div>
  )
}
