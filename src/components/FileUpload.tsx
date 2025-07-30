import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
}

export const FileUpload = ({ onFileSelect, acceptedTypes = [".csv", ".json"] }: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      onFileSelect(file);
      toast.success(`File "${file.name}" uploaded successfully!`);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    multiple: false,
  });

  const handleRemoveFile = () => {
    setUploadedFile(null);
    toast.info("File removed");
  };

  return (
    <Card className="p-8">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-primary bg-accent scale-105"
              : "border-muted-foreground/25 hover:border-primary hover:bg-accent/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-gradient-primary">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragActive ? "Drop your file here" : "Upload your data file"}
              </h3>
              <p className="text-muted-foreground">
                Drag & drop your CSV or JSON file, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supported formats: {acceptedTypes.join(", ")}
              </p>
            </div>
            <Button variant="gradient" className="mt-4">
              Choose File
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};