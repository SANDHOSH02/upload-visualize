import { useState } from "react";
import Papa from "papaparse";
import { FileUpload } from "@/components/FileUpload";
import { DataTable } from "@/components/DataTable";
import { DataCharts } from "@/components/DataCharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Upload, Table, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    setIsLoading(true);
    setFileName(file.name);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        complete: (results) => {
          if (results.errors.length > 0) {
            toast.error("Error parsing CSV file");
            console.error(results.errors);
          } else {
            setData(results.data as Record<string, any>[]);
            toast.success("CSV file processed successfully!");
          }
          setIsLoading(false);
        },
        header: true,
        skipEmptyLines: true,
      });
    } else if (fileExtension === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          const processedData = Array.isArray(jsonData) ? jsonData : [jsonData];
          setData(processedData);
          toast.success("JSON file processed successfully!");
        } catch (error) {
          toast.error("Error parsing JSON file");
          console.error(error);
        }
        setIsLoading(false);
      };
      reader.readAsText(file);
    } else {
      toast.error("Unsupported file format");
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setData([]);
    setFileName("");
    toast.info("Data cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm animate-float">
                <BarChart3 className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              Data Analysis <span className="text-primary-glow">Studio</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Transform your data into beautiful visualizations and insights. 
              Upload CSV or JSON files and explore your data instantly.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                CSV Support
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                JSON Support
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                Real-time Charts
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Upload Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Upload className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Upload Data</h2>
              </div>
              {data.length > 0 && (
                <Button variant="outline" onClick={clearData}>
                  Clear Data
                </Button>
              )}
            </div>
            <FileUpload onFileSelect={handleFileSelect} />
          </section>

          {isLoading && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Processing your file...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Section */}
          {data.length > 0 && !isLoading && (
            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
                    <Table className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.length.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Columns</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data.length > 0 ? Object.keys(data[0]).length : 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">File Name</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold truncate">{fileName}</div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* Data Table Section */}
          {data.length > 0 && !isLoading && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Table className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Data Preview</h2>
              </div>
              <DataTable data={data} />
            </section>
          )}

          {/* Charts Section */}
          {data.length > 0 && !isLoading && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Visualizations</h2>
              </div>
              <DataCharts data={data} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;