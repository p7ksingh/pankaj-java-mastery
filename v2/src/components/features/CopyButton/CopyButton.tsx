'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

interface CopyButtonProps {
  text: string
  label?: string
}

export function CopyButton({ text, label = 'Copy Answer' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available, fallback
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [text])

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? 'Copied' : label}
    </Button>
  )
}
