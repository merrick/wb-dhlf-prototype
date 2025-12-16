/**
 * Mappings Page
 * Version: 3.1.0
 *
 * Excel import functionality for role-competency mappings
 * v3.1.0: Made preview modal responsive with scrollbar
 */

import { useState } from 'react';
import { apiClient, type MappingPreview } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export function MappingsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<MappingPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please select an Excel file (.xlsx or .xls)');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setSuccess(null);
    parseFile(file);
  };

  const parseFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const response = await apiClient.parseMapping(file);
      setPreview(response.preview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preview) return;

    setLoading(true);
    setError(null);

    try {
      // Save the mappings using the valid codes from the preview
      const saveResponse = await apiClient.saveMapping({
        roleCode: preview.role.roleCode,
        competencyCodes: preview.validCodes
      });

      setSuccess(saveResponse.message);
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save mappings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Excel Mapping Import</h1>
        <p className="text-lg text-slate-600">
          Upload Excel spreadsheets to map competencies to professional roles.
        </p>
      </div>

      {/* File Upload Card */}
      <Card className="glass-effect border-l-4 border-blue-500 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload Mapping Spreadsheet
          </CardTitle>
          <CardDescription>
            Select an Excel file containing role-competency mappings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileSpreadsheet className="h-16 w-16 mx-auto text-slate-400 mb-4" />
            <p className="text-lg font-medium text-slate-700 mb-2">
              Drag and drop your Excel file here
            </p>
            <p className="text-sm text-slate-500 mb-4">or</p>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
              <Button variant="default">Browse Files</Button>
            </label>
            {selectedFile && (
              <div className="mt-4 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 inline mr-2 text-green-600" />
                Selected: <strong>{selectedFile.name}</strong>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="glass-effect">
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Processing file...</p>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="glass-effect border-l-4 border-red-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {success && (
        <Card className="glass-effect border-l-4 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Success</p>
                <p className="text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!preview} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Mapping Import</DialogTitle>
                <DialogDescription>
                  Review the parsed data before saving to the database
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Role Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800">Role Information</h4>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-1">
                    <p><strong>Excel Role:</strong> {preview.excelRoleName}</p>
                    <p><strong>Database Role:</strong> {preview.role.roleTitle}</p>
                    <p><strong>Role Type:</strong> {preview.role.roleType}</p>
                    <p><strong>Sheet:</strong> {preview.sheetName}</p>
                  </div>
                </div>

                {/* Competency Stats */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800">Competency Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">{preview.competencyCount}</div>
                      <div className="text-sm text-blue-600">Total Competencies</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-700">{preview.validCompetencies}</div>
                      <div className="text-sm text-green-600">Valid Competencies</div>
                    </div>
                  </div>
                </div>

                {/* Validation Issues */}
                {preview.invalidCompetencies > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-900">
                          {preview.invalidCompetencies} Invalid Competency Code(s)
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          The following codes were not found in the database:
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {preview.invalidCodes.map((code, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs font-mono rounded">
                              {code}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Mappings Warning */}
                {preview.existingMappingsCount > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-900">Replace Existing Mappings</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          This role has {preview.existingMappingsCount} existing mapping(s). Proceeding will <strong>delete</strong> all
                          existing mappings and replace them with the {preview.validCompetencies} competencies from this file.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading || preview.invalidCompetencies > 0}
                >
                  {loading ? 'Saving...' : `Save ${preview.validCompetencies} Mappings`}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
