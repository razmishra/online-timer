// components/PaymentStatusModal.js
'use client'

import { memo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, X } from 'lucide-react'

const  PaymentStatusModal = ({ 
  isOpen, 
  onClose, 
  status = 'success', // 'success' or 'failed'
  errorDetails = {}
}) => {
  const router = useRouter()
  const isSuccess = status === 'success'

  // Auto-redirect after 5 seconds for success, 8 seconds for failure
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleClose()
      }, isSuccess ? 5000 : 8000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, isSuccess])

  const handleClose = () => {
    if (isSuccess) {
      router.push('/')
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Modern gradient backdrop with minimal blur */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/30 backdrop-blur-[1px] transition-all duration-300"
        onClick={handleClose}
      />
      
      {/* Modal with glassmorphism effect */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-[1px]">
            <div className="h-full w-full rounded-2xl bg-white/90 backdrop-blur-xl" />
          </div>
          
          {/* Content */}
          <div className="relative px-6 pb-6 pt-8">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              {/* Status icon with animated background */}
              <div className="relative mx-auto mb-6">
                <div className={`absolute inset-0 rounded-full blur-lg ${
                  isSuccess ? 'bg-green-500/30' : 'bg-red-500/30'
                } animate-pulse`} />
                <div className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 ${
                  isSuccess 
                    ? 'bg-green-50/80 border-green-200/50 backdrop-blur-sm' 
                    : 'bg-red-50/80 border-red-200/50 backdrop-blur-sm'
                }`}>
                  {isSuccess ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </div>

              {/* Status message */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-2">
                  {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isSuccess 
                    ? 'Your payment has been processed successfully.'
                    : 'There was an issue processing your payment. Please try again.'
                  }
                </p>
              </div>

              {/* Auto redirect/retry message */}
              <p className="mb-6 text-xs text-gray-500 bg-gray-50/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200/20">
                {isSuccess 
                  ? '✨ Redirecting to home page in 5 seconds...'
                  : '⏱️ This dialog will close in 8 seconds...'
                }
              </p>

              {/* Action buttons with glassmorphism */}
              <div className="space-y-3">
                {isSuccess && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-green-600 hover:to-green-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-all duration-200 transform hover:scale-[1.02]"
                    onClick={handleClose}
                  >
                   Go to home page
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default memo(PaymentStatusModal)