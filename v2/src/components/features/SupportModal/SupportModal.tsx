'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from './SupportModal.module.css'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Support modal with two tabs: UPI (India) and Buy Me a Coffee (International).
 * UPI tab shows QR code + UPI ID with copy button.
 * Coffee tab links to Buy Me a Coffee page.
 */
export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [tab, setTab] = useState<'upi' | 'coffee'>('upi')
  const [copied, setCopied] = useState(false)

  const UPI_ID = 'pksingh.w-1@okicici'
  const COFFEE_URL = 'https://buymeacoffee.com/pksingh.w'

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const copyUpi = useCallback(() => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.title}>☕ Buy me a coffee</span>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'upi' ? styles.tabActive : ''}`}
            onClick={() => setTab('upi')}
          >
            🇮🇳 UPI (India)
          </button>
          <button
            className={`${styles.tab} ${tab === 'coffee' ? styles.tabActive : ''}`}
            onClick={() => setTab('coffee')}
          >
            🌍 International
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {tab === 'upi' ? (
            <>
              <Image
                src="/upi-qr.png"
                alt="UPI QR Code"
                width={200}
                height={200}
                className={styles.qrImage}
              />
              <div className={styles.upiId}>
                {UPI_ID}
                <button className={styles.copyBtn} onClick={copyUpi}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p className={styles.hint}>Scan with any UPI app: GPay, PhonePe, Paytm</p>
            </>
          ) : (
            <>
              <a href={COFFEE_URL} target="_blank" rel="noopener noreferrer" className={styles.coffeeBtn}>
                <span className={styles.coffeeEmoji}>☕</span>
                Buy me a coffee
              </a>
              <p className={styles.hint}>Pay with international card, Google Pay, or Apple Pay</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
