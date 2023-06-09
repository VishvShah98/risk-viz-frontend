import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { useSnapshot } from 'valtio';
import state from '../state';

function DataTable() {

  const [rows, setRows] = useState<Array<any>>([]);
  const { palette } = useTheme();
  const snapshot = useSnapshot(state);

  //format risk factors
  function formatRiskFactors(riskFactorsStr: string): string {
    const riskFactors = JSON.parse(riskFactorsStr);
    const formattedRiskFactors = Object.entries(riskFactors)
      .map(([key, value]) => `${key}: ${Number(value).toFixed(2)}`)
      .join(', ');

    return formattedRiskFactors;
  }

  //set rows
  useEffect(() => {
    const dataRows = state.data.map((data: any) => ({
      id: data._id,
      assetName: data['Asset Name'],
      businessCategory: data['Business Category'],
      riskFactors: formatRiskFactors(data['Risk Factors']),
      riskRating: data['Risk Rating'],
    }));

    setRows(dataRows);
  }, [snapshot.data]);

  //columns
  const columns: GridColDef[] = [
    { field: 'assetName', headerName: 'Asset Name', width: 220 },
    { field: 'businessCategory', headerName: 'Business Category', width: 155 },
    { field: 'riskFactors', headerName: 'Risk Factors', width: 660 },
    { field: 'riskRating', headerName: 'Risk Rating', width: 150 },
  ];

  return (
    <Box className="data-table" sx={{
      height: 400,

      // boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, .8)",
      // '.MuiDataGrid-columnHeaderTitle': { fontSize: 15, fontWeight: 'bolder !important' },

      "& .MuiDataGrid-cell": {
        borderBottom: `1px solid ${palette.grey[800]} !important`,
      },
      "& .MuiDataGrid-columnHeaders": {
        borderBottom: `2px solid ${palette.grey[800]} !important`,
      },


    }} >
      <Typography style={{ color: 'white', marginBottom: '1rem', fontWeight: 500, textAlign: 'center' }}>Climate Risk Data Table for Selected Decade</Typography>
      <DataGrid
        sx={{
          backgroundColor: 'white', color: 'black', borderRadius: '1rem',
          boxShadow: '0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.8)',
        }}
        rows={rows}
        columns={columns}
        columnHeaderHeight={55}
        pagination
        rowHeight={50}
        filterModel={{
          items: [
            {
              field: 'assetName', operator: 'contains', value: state.tabelFilter
            }
          ]
        }}
      />
    </Box>
  );
}

export default DataTable;
