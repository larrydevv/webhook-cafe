'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trash2, Download, Copy, Users, Loader2, AlertTriangle } from 'lucide-react'

interface BulkActionsToolbarProps {
  selectedIds: string[]
  totalCount: number
  onDelete: (ids: string[]) => Promise<void>
  onExport: (ids: string[]) => void
  onClearSelection: () => void
}

export function BulkActionsToolbar({
  selectedIds,
  totalCount,
  onDelete,
  onExport,
  onClearSelection,
}: BulkActionsToolbarProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(selectedIds)
    setDeleting(false)
    setDeleteDialogOpen(false)
  }

  if (selectedIds.length === 0) {
    return null
  }

  return (
    <>
      <Card className="mb-4 border-primary bg-primary/5">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {selectedIds.length} selected
              </Badge>
              <span className="text-sm text-muted-foreground">
                of {totalCount} items
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport(selectedIds)}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
              >
                Clear
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete {selectedIds.length} Item(s)?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the selected item(s) and remove their data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Bulk Import Component
interface BulkImportProps {
  onImport: (data: any[]) => Promise<void>
  template?: { name: string; fields: string[] }
}

export function BulkImport({ onImport, template }: BulkImportProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload')
  const [csvData, setCsvData] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Simple CSV parser (in production, use a proper CSV library)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(l => l.trim())
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      const data = lines.slice(1).map((line, i) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
        const obj: any = {}
        headers.forEach((header, j) => {
          obj[header] = values[j] || ''
        })
        return obj
      })

      setCsvData(data)
      setStep('preview')
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    setStep('importing')
    try {
      await onImport(csvData)
      setStep('complete')
    } catch (error) {
      setErrors([(error as Error).message])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import</CardTitle>
        <CardDescription>
          Import multiple items from a CSV file
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <p className="text-muted-foreground">
                  Click to upload CSV file
                </p>
              </label>
            </div>
            {template && (
              <div className="text-sm">
                <p className="font-medium mb-2">Expected columns:</p>
                <div className="flex flex-wrap gap-2">
                  {template.fields.map((field) => (
                    <Badge key={field} variant="outline">{field}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <p className="text-sm">
              Found {csvData.length} items. Review before importing.
            </p>
            <div className="border rounded-lg overflow-auto max-h-64">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {Object.keys(csvData[0] || {}).map((key) => (
                      <th key={key} className="p-2 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-t">
                      {Object.values(row).map((value: any, j) => (
                        <td key={j} className="p-2">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {csvData.length > 5 && (
              <p className="text-sm text-muted-foreground">
                ...and {csvData.length - 5} more items
              </p>
            )}
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Cancel
              </Button>
              <Button onClick={handleImport} className="gap-2">
                <Users className="w-4 h-4" />
                Import {csvData.length} Items
              </Button>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Importing {csvData.length} items...</p>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-8">
            <p className="text-green-500 font-medium mb-2">
              Successfully imported {csvData.length} items!
            </p>
            <Button onClick={() => setStep('upload')}>Import More</Button>
          </div>
        )}

        {errors.length > 0 && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {errors.map((error, i) => (
              <p key={i}>{error}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
