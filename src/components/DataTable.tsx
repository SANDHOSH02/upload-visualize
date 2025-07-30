import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DataTableProps {
  data: Record<string, any>[];
  title?: string;
}

export const DataTable = ({ data, title = "Data Preview" }: DataTableProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data to display. Upload a file to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const columns = Object.keys(data[0]);
  const displayData = data.slice(0, 10); // Show first 10 rows

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {data.length} row{data.length !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary">
              {columns.length} column{columns.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="font-semibold">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column} className="font-mono text-sm">
                      {String(row[column] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {data.length > 10 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Showing first 10 rows of {data.length} total rows
          </p>
        )}
      </CardContent>
    </Card>
  );
};