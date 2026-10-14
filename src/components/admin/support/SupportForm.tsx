import { useState, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Copy, ImagePlus, Send, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface UploadedImage {
  file: File
  preview: string
}

export default function SupportForm() {
  const location = useLocation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<UploadedImage[]>([])
  const [copied, setCopied] = useState(false)

  const currentUrl = `${window.location.origin}${location.pathname}`

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      toast.success('URL copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy URL')
    }
  }

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = 5 - images.length
    const validFiles = files.slice(0, remaining)

    const newImages: UploadedImage[] = []
    for (const file of validFiles) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`)
        continue
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        continue
      }
      newImages.push({ file, preview: URL.createObjectURL(file) })
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages])
      toast.success(`${newImages.length} image(s) added`)
    }

    if (files.length > remaining) {
      toast.error(`Only ${remaining} more image(s) allowed`)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [images.length])

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const handleSubmit = () => {
    if (!summary.trim()) {
      toast.error('Please provide a summary of the issue')
      return
    }
    if (!description.trim()) {
      toast.error('Please describe what happened')
      return
    }
    toast.success('Ticket submitted successfully!')
    setSummary('')
    setDescription('')
    setImages([])
  }

  const handleCancel = () => {
    setSummary('')
    setDescription('')
    setImages([])
    toast('Form cleared')
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, border: '1px solid var(--border)' }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: 'var(--brand-dark)' }}>Raise a ticket</h2>
      <p style={{ margin: '0 0 28px', fontSize: 14, color: 'var(--muted-foreground)' }}>
        Describe the issue you are facing. We will use the current page URL for context.
      </p>

      {/* Current Page URL */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 8 }}>
          Current page URL (automatically captured)
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={currentUrl}
            readOnly
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: 14,
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: '#f8f9fb',
              color: 'var(--foreground)',
              outline: 'none',
            }}
          />
          <button
            onClick={handleCopyUrl}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: '#fff',
              color: 'var(--foreground)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted-foreground)' }}>
          This URL will be sent with your ticket to help us understand the issue better.
        </p>
      </div>

      {/* Brief Summary */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 8 }}>
          Brief summary of the issue <span style={{ color: 'var(--destructive)' }}>*</span>
        </label>
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value.slice(0, 100))}
          placeholder="Example: Unable to save room details"
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: 14,
            border: '1px solid var(--border)',
            borderRadius: 8,
            background: '#fff',
            color: 'var(--foreground)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>
          {summary.length}/100
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 8 }}>
          Describe what happened and what you expected <span style={{ color: 'var(--destructive)' }}>*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
          placeholder="Please provide as much detail as possible..."
          rows={6}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: 14,
            border: '1px solid var(--border)',
            borderRadius: 8,
            background: '#fff',
            color: 'var(--foreground)',
            outline: 'none',
            resize: 'vertical',
            fontFamily: "'Inter', sans-serif",
            boxSizing: 'border-box',
          }}
        />
        <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>
          {description.length}/1000
        </div>
      </div>

      {/* Image Upload */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 8 }}>
          Images only · max 5 files ({images.length}/5) · 5MB each
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {images.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--primary)',
              borderRadius: 8,
              padding: '32px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f8f9fb',
            }}
          >
            <ImagePlus size={40} color="var(--primary)" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 14, color: 'var(--muted-foreground)', marginBottom: 12 }}>No file chosen</div>
            <button
              type="button"
              style={{
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600,
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Add image
            </button>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 10 }}>
              Add screenshots or photos to help us understand the issue.
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
              {images.map((img, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    width: 110,
                    height: 110,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={img.preview}
                    alt={`Upload ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 500,
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Add image
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 500,
            background: '#fff',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 600,
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          <Send size={16} />
          Submit ticket
        </button>
      </div>
    </div>
  )
}
