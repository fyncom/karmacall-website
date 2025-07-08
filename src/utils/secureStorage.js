/**
 * Secure Storage Utility
 * Provides encrypted storage for sensitive data with additional security measures
 */

/**
 * Simple encryption/decryption using Web Crypto API
 * This is basic client-side encryption - for production, consider server-side encryption
 */
class SecureStorage {
  constructor() {
    this.keyName = "karmacall_storage_key"
    this.initPromise = this.init()
  }

  /**
   * Initialize the secure storage with encryption key
   */
  async init() {
    if (typeof window === "undefined") return

    try {
      // Check if we have a stored key
      let keyData = localStorage.getItem(this.keyName)

      if (!keyData) {
        // Generate a new key
        const key = await window.crypto.subtle.generateKey(
          {
            name: "AES-GCM",
            length: 256,
          },
          true,
          ["encrypt", "decrypt"]
        )

        // Export and store the key
        const exportedKey = await window.crypto.subtle.exportKey("raw", key)
        keyData = Array.from(new Uint8Array(exportedKey))
        localStorage.setItem(this.keyName, JSON.stringify(keyData))
        this.cryptoKey = key
      } else {
        // Import existing key
        const keyArray = new Uint8Array(JSON.parse(keyData))
        this.cryptoKey = await window.crypto.subtle.importKey("raw", keyArray, "AES-GCM", true, ["encrypt", "decrypt"])
      }
    } catch (error) {
      console.error("Failed to initialize secure storage:", error)
      // Fallback to no encryption
      this.cryptoKey = null
    }
  }

  /**
   * Encrypt data using AES-GCM
   * @param {string} data - Data to encrypt
   * @returns {string} - Encrypted data as base64 string
   */
  async encrypt(data) {
    if (!this.cryptoKey || typeof window === "undefined") {
      return data // Fallback to plain text if encryption fails
    }

    try {
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(data)

      // Generate random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12))

      // Encrypt the data
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        this.cryptoKey,
        dataBuffer
      )

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encrypted), iv.length)

      // Convert to base64
      return btoa(String.fromCharCode(...combined))
    } catch (error) {
      console.error("Encryption failed:", error)
      return data // Fallback to plain text
    }
  }

  /**
   * Decrypt data using AES-GCM
   * @param {string} encryptedData - Encrypted data as base64 string
   * @returns {string} - Decrypted data
   */
  async decrypt(encryptedData) {
    if (!this.cryptoKey || typeof window === "undefined") {
      return encryptedData // Fallback to plain text if decryption fails
    }

    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData)
          .split("")
          .map(c => c.charCodeAt(0))
      )

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12)
      const encrypted = combined.slice(12)

      // Decrypt the data
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        this.cryptoKey,
        encrypted
      )

      // Convert back to string
      const decoder = new TextDecoder()
      return decoder.decode(decrypted)
    } catch (error) {
      console.error("Decryption failed:", error)
      return encryptedData // Fallback to encrypted data
    }
  }

  /**
   * Securely store data
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @param {boolean} encrypt - Whether to encrypt the data
   */
  async setItem(key, value, encrypt = true) {
    if (typeof window === "undefined") return

    await this.initPromise

    try {
      const dataToStore = encrypt ? await this.encrypt(value) : value
      const metadata = {
        data: dataToStore,
        encrypted: encrypt,
        timestamp: Date.now(),
        checksum: this.generateChecksum(value),
      }

      localStorage.setItem(`secure_${key}`, JSON.stringify(metadata))
    } catch (error) {
      console.error("Failed to store data securely:", error)
      // Fallback to regular localStorage
      localStorage.setItem(key, value)
    }
  }

  /**
   * Securely retrieve data
   * @param {string} key - Storage key
   * @param {string} defaultValue - Default value if not found
   * @returns {string} - Retrieved value
   */
  async getItem(key, defaultValue = null) {
    if (typeof window === "undefined") return defaultValue

    await this.initPromise

    try {
      const stored = localStorage.getItem(`secure_${key}`)
      if (!stored) {
        // Check fallback in regular localStorage
        return localStorage.getItem(key) || defaultValue
      }

      const metadata = JSON.parse(stored)
      const value = metadata.encrypted ? await this.decrypt(metadata.data) : metadata.data

      // Verify checksum
      if (metadata.checksum && metadata.checksum !== this.generateChecksum(value)) {
        console.warn("Data integrity check failed for key:", key)
        this.removeItem(key)
        return defaultValue
      }

      return value
    } catch (error) {
      console.error("Failed to retrieve data securely:", error)
      // Fallback to regular localStorage
      return localStorage.getItem(key) || defaultValue
    }
  }

  /**
   * Remove item from secure storage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    if (typeof window === "undefined") return

    localStorage.removeItem(`secure_${key}`)
    // Also remove from regular localStorage as fallback
    localStorage.removeItem(key)
  }

  /**
   * Generate checksum for data integrity
   * @param {string} data - Data to generate checksum for
   * @returns {string} - Checksum
   */
  generateChecksum(data) {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }

  /**
   * Clear all secure storage
   */
  clear() {
    if (typeof window === "undefined") return

    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("secure_")) {
        keys.push(key)
      }
    }

    keys.forEach(key => localStorage.removeItem(key))
    localStorage.removeItem(this.keyName)
  }

  /**
   * Check if data has expired
   * @param {string} key - Storage key
   * @param {number} maxAge - Maximum age in milliseconds
   * @returns {boolean} - Whether data has expired
   */
  async isExpired(key, maxAge = 24 * 60 * 60 * 1000) {
    // Default 24 hours
    if (typeof window === "undefined") return true

    try {
      const stored = localStorage.getItem(`secure_${key}`)
      if (!stored) return true

      const metadata = JSON.parse(stored)
      return Date.now() - metadata.timestamp > maxAge
    } catch (error) {
      return true
    }
  }
}

// Create singleton instance
const secureStorage = new SecureStorage()

// Define sensitive keys that should be encrypted
const SENSITIVE_KEYS = [
  "userId",
  "sessionId",
  "phoneNumber",
  "countryCode",
  "otp",
  "nanoAccount",
  "auth0AccessToken",
  "auth0IdToken",
  "auth0RefreshToken",
  "email",
]

/**
 * Secure wrapper functions for localStorage
 */
export const secureSetItem = async (key, value) => {
  const shouldEncrypt = SENSITIVE_KEYS.includes(key)
  await secureStorage.setItem(key, value, shouldEncrypt)
}

export const secureGetItem = async (key, defaultValue = null) => {
  return await secureStorage.getItem(key, defaultValue)
}

export const secureRemoveItem = key => {
  secureStorage.removeItem(key)
}

export const secureClear = () => {
  secureStorage.clear()
}

export const checkExpiration = async (key, maxAge) => {
  return await secureStorage.isExpired(key, maxAge)
}

/**
 * Migration utility to move existing localStorage data to secure storage
 */
export const migrateToSecureStorage = async () => {
  if (typeof window === "undefined") return

  console.log("Migrating to secure storage...")

  for (const key of SENSITIVE_KEYS) {
    const value = localStorage.getItem(key)
    if (value) {
      await secureSetItem(key, value)
      localStorage.removeItem(key)
    }
  }

  console.log("Migration to secure storage complete")
}

export default secureStorage
