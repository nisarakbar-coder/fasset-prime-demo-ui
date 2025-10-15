'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadFieldProps {
  fieldName: string
  placeholder: string
  value: string
  onFileUpload: (fieldName: string, file: File) => void
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>
}

export function FileUploadField({ 
  fieldName, 
  placeholder, 
  value, 
  onFileUpload, 
  fileInputRefs 
}: FileUploadFieldProps) {
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid file (JPEG, PNG, or PDF)')
        return
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB')
        return
      }

      onFileUpload(fieldName, file)
    }
  }

  const handleUploadClick = () => {
    const input = fileInputRefs.current[fieldName]
    if (input) {
      input.click()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={placeholder}
        readOnly
        value={value}
        className="font-mono text-sm"
      />
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        onClick={handleUploadClick}
      >
        <Upload className="h-4 w-4" />
      </Button>
      <input
        ref={(el) => fileInputRefs.current[fieldName] = el}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  )
}
