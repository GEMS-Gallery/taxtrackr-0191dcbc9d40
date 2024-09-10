import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, CircularProgress } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

type TaxPayer = {
  tid: number;
  firstName: string;
  lastName: string;
  address: string;
};

const columns = [
  { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
  { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
  { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
  { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
];

function App() {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTid, setSearchTid] = useState('');
  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getAllTaxPayers();
      setTaxPayers(result);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const onSubmit = async (data: TaxPayer) => {
    setLoading(true);
    try {
      await backend.createTaxPayer(BigInt(data.tid), data.firstName, data.lastName, data.address);
      reset();
      await fetchTaxPayers();
    } catch (error) {
      console.error('Error creating tax payer:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (searchTid) {
      setLoading(true);
      try {
        const result = await backend.searchTaxPayer(BigInt(searchTid));
        if (result.length > 0) {
          setTaxPayers([result[0]]);
        } else {
          setTaxPayers([]);
        }
      } catch (error) {
        console.error('Error searching tax payer:', error);
      }
      setLoading(false);
    } else {
      fetchTaxPayers();
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        TaxPayer Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="tid"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="TID" fullWidth margin="normal" />}
            />
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="First Name" fullWidth margin="normal" />}
            />
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Last Name" fullWidth margin="normal" />}
            />
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Address" fullWidth margin="normal" />}
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Add TaxPayer'}
            </Button>
          </form>
          <TextField
            label="Search by TID"
            value={searchTid}
            onChange={(e) => setSearchTid(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleSearch} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Grid>
        <Grid item xs={12} md={8}>
          <div style={{ height: 400, width: '100%' }}>
            <DataTable
              columns={columns}
              data={taxPayers}
              pagination
              progressPending={loading}
              progressComponent={<CircularProgress />}
            />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
