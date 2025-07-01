import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data
const rentals = [
  { id: 'r1', vehicleName: 'Jeep Wrangler', renterName: 'Alex Johnson', date: '2024-06-15', earnings: 250 },
  { id: 'r2', vehicleName: 'Porsche 911', renterName: 'Maria Garcia', date: '2024-06-12', earnings: 700 },
  { id: 'r3', name: 'Jeep Wrangler', renterName: 'Sam Lee', date: '2024-05-28', earnings: 300 },
];

export default function OwnerRentalHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Rental History</CardTitle>
          <CardDescription>A log of all completed rentals for your vehicles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Renter</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.vehicleName}</TableCell>
                  <TableCell>{rental.renterName}</TableCell>
                  <TableCell>{rental.date}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">+${rental.earnings.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
