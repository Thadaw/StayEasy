import { useState } from 'react'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <section className="px-10 py-16 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Stay in the loop
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Get exclusive deals, new property alerts, and travel tips straight to your inbox.
        </p>
        {subscribed ? (
          <p className="text-green-600 text-sm font-medium">Thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-500 transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Newsletter
