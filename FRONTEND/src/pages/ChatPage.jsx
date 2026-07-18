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

    Promise.all([
      getChatHistory(rideId),
      getMyTrips()
    ]).then(([history, trips]) => {
      if (!alive) return
      setMessages(history)
      
      const ride = trips.find(t => t._id === rideId)
      if (ride) setRideInfo(ride)
    }).catch(console.error)

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
  
  let callName = 'Driver'
  let callPhone = ''
  
  if (rideInfo) {
    const isDriver = rideInfo.driverId?._id === user?._id || rideInfo.driverId === user?._id
    if (isDriver) {
      callName = 'Passenger'
      callPhone = rideInfo.passengers?.[0]?.userId?.phone || ''
    } else {
      callName = rideInfo.driverId?.name || 'Driver'
      callPhone = rideInfo.driverId?.phone || ''
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '1rem', background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <button className="secondary-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => navigate(-1)}>← Back</button>
        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {rideInfo ? `${rideInfo.pickupLocation?.address.split(',')[0]} → ${rideInfo.destinationLocation?.address.split(',')[0]}` : 'Loading...'}
        </div>
        {callPhone ? (
          <a href={`tel:${callPhone}`} className="primary-btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', textDecoration: 'none', background: 'var(--success)' }}>
            📞 Call
          </a>
        ) : (
          <button className="secondary-btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', opacity: 0.5 }} disabled>📞 Call</button>
        )}
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 && (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
            <p>No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.senderId === user?._id
          return (
            <div key={msg._id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              {!isMe && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', marginLeft: '0.5rem' }}>{msg.senderName}</div>}
              <div style={{ 
                background: isMe ? 'var(--accent)' : 'white', 
                color: isMe ? 'white' : 'var(--text-primary)', 
                padding: '0.8rem 1.2rem', 
                borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                border: isMe ? 'none' : '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {msg.text}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', textAlign: isMe ? 'right' : 'left', marginRight: isMe ? '0.5rem' : 0, marginLeft: isMe ? 0 : '0.5rem' }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid var(--border)' }}>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '99px', border: '1px solid var(--border)', background: 'var(--bg-primary)' }}
          />
          <button type="submit" className="primary-btn" disabled={!inputText.trim()} style={{ padding: '0 1.5rem', borderRadius: '99px' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
