import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyableProps {
  value: string
  className?: string
  showButton?: boolean
  inputClassName?: string
  buttonClassName?: string
}

export function Copyable({ 
  value, 
  className, 
  showButton = true, 
  inputClassName,
  buttonClassName 
}: CopyableProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Input
        value={value}
        readOnly
        className={cn('font-mono text-sm', inputClassName)}
      />
      {showButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className={cn('shrink-0', buttonClassName)}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}
