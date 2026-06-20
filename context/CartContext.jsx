"use client"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    let active = true
    let restoredCart = []

    try {
      const savedCart = window.localStorage.getItem("pcbuilder-cart")
      if (savedCart) restoredCart = JSON.parse(savedCart)
    } catch (error) {
      console.warn("Saved cart could not be restored.", error)
    }

    queueMicrotask(() => {
      if (!active) return
      setCart(restoredCart)
      setIsHydrated(true)
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem("pcbuilder-cart", JSON.stringify(cart))
    }
  }, [cart, isHydrated])

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    const nextQuantity = Number(quantity)

    if (nextQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
      return
    }

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item))
    )
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart]
  )
  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, isHydrated }),
    [addToCart, cart, clearCart, isHydrated, removeFromCart, total, updateQuantity]
  )

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used inside CartProvider")
  }

  return context
}
